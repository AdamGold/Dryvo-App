import React from "react"
import {
	KeyboardAvoidingView,
	Text,
	StyleSheet,
	View,
	TouchableHighlight,
	ScrollView,
	Platform
} from "react-native"
import { connect } from "react-redux"
import { Button, Icon } from "react-native-elements"
import { strings } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import {
	MAIN_PADDING,
	fullButton,
	API_DATE_FORMAT,
	DEFAULT_DURATION,
	SHORT_API_DATE_FORMAT,
	DEFAULT_MESSAGE_TIME
} from "../../consts"
import NewLessonInput from "../../components/NewLessonInput"
import Hours from "../../components/Hours"
import InputSelectionButton from "../../components/InputSelectionButton"
import moment from "moment"
import { API_ERROR } from "../../reducers/consts"
import SlidingMessage from "../../components/SlidingMessage"
import { getHoursDiff, fetchOrError, popLatestError } from "../../actions/utils"
import { getLessonById } from "../../actions/lessons"

export class Lesson extends React.Component {
	constructor(props) {
		super(props)
		const duration = props.user.lesson_duration || DEFAULT_DURATION
		this.state = {
			date: props.navigation.getParam("date"),
			error: "",
			hours: [],
			students: [],
			student: {},
			dateAndTime: "",
			defaultDuration: duration.toString(),
			allTopics: [],
			progress: [],
			finished: [],
			slidingMessageVisible: false
		}
		this._initializeInputs = this._initializeInputs.bind(this)
		this.setRef = this.setRef.bind(this)
		this.onChangeText = this.onChangeText.bind(this)
		this._onHourPress = this._onHourPress.bind(this)
		this._onStudentPress = this._onStudentPress.bind(this)
		this.submit = this.submit.bind(this)

		this._initializeInputs()
		this._getAvailableHours()
		this._initializeExistingLesson()
	}

	_initializeExistingLesson = async () => {
		// if we're editing a lesson
		let lesson = this.props.navigation.getParam("lesson") || null
		if (this.props.navigation.getParam("lesson_id")) {
			lesson = await getLessonById(
				this.props.navigation.getParam("lesson_id")
			)
		}
		if (lesson) {
			// init duration, studentName, meetup, dropoff, hour
			this.state = {
				...this.state,
				lesson,
				student: lesson.student,
				date: moment.utc(lesson.date).format(SHORT_API_DATE_FORMAT),
				dateAndTime: moment.utc(lesson.date).format(API_DATE_FORMAT),
				studentName: lesson.student.user.name,
				duration: lesson.duration.toString(),
				meetup: (lesson.meetup_place || {}).name,
				dropoff: (lesson.dropoff_place || {}).name,
				hour: moment.utc(lesson.date).format("HH:mm")
			}
		}
		await this._getTopics()
	}

	_initializeInputs = () => {
		let studentEditable = {}
		if (this.state.lesson) {
			studentEditable = { editable: false, selectTextOnFocus: false }
		}
		this.inputs = {
			date: {
				iconName: "date-range",
				editable: false,
				selectTextOnFocus: false
			},
			duration: {
				iconName: "swap-horiz",
				extraPlaceholder: ` (${strings(
					"teacher.new_lesson.default"
				)}: ${this.state.defaultDuration})`,
				onBlur: input => {
					this._getAvailableHours()
					this.onBlur(input)
				},
				style: { marginTop: 0 }
			},
			hour: {
				iconName: "access-time",
				below: this.renderHours,
				editable: false,
				selectTextOnFocus: false
			},
			studentName: {
				iconName: "person-outline",
				below: this.renderStudents,
				onChangeText: (name, value) => {
					this.onChangeText(name, value)
					this._getStudents(value)
				},
				...studentEditable
			},
			meetup: {
				iconName: "navigation",
				iconType: "feather",
				onSubmitEditing: () => {
					this.dropoffInput.focus()
					this._scrollView.scrollTo({ y: 50, animated: true })
				}
			},
			dropoff: {
				iconName: "map-pin",
				iconType: "feather",
				onSubmitEditing: () => {
					this._touchable.touchableHandlePress()
				}
			}
		}

		Object.keys(this.inputs).forEach(input => {
			if (!this.state[input]) {
				this.state[input] = ""
			}
		})
	}

	componentDidUpdate() {
		const error = this.props.dispatch(popLatestError(API_ERROR))
		if (error) {
			this.setState({
				error,
				slidingMessageVisible: true
			})
		}
	}

	_getAvailableHours = async () => {
		if (!this.state.date) return
		const resp = await this.props.fetchService.fetch(
			`/teacher/${this.props.user.teacher_id}/available_hours`,
			{
				method: "POST",
				body: JSON.stringify({
					date: this.state.date,
					duration:
						this.state.duration || this.props.user.lesson_duration
				})
			}
		)
		this.setState({
			hours: resp.json["data"]
		})
	}

	_getStudents = async (name = "") => {
		if (name.length < 3) return
		const resp = await this.props.fetchService.fetch(
			"/teacher/students?name=" + name,
			{
				method: "GET"
			}
		)
		this.setState({
			students: resp.json["data"]
		})
	}

	onFocus = input => {
		this.setState({ [`${input}Color`]: "rgb(12,116,244)" })
	}

	onBlur = input => {
		this.setState({ [`${input}Color`]: undefined })
	}

	onChangeText = (name, value) => this.setState({ [name]: value })

	setRef = (input, name) => {
		this[`${name}Input`] = input
	}

	renderInputs = () => {
		const keys = Object.keys(this.inputs)
		return keys.map((name, index) => {
			const props = this.inputs[name]
			const next = keys[index + 1]
			return (
				<NewLessonInput
					key={`key${index}`}
					name={name}
					editable={props.editable}
					selectTextOnFocus={props.selectTextOnFocus}
					autoFocus={props.autoFocus}
					setRef={this.setRef}
					onFocus={this.onFocus}
					onBlur={props.onBlur || this.onBlur}
					onChangeText={props.onChangeText || this.onChangeText}
					iconName={props.iconName}
					next={() => this[`${next}Input`]}
					state={this.state}
					iconType={props.iconType}
					onSubmitEditing={props.onSubmitEditing}
					extraPlaceholder={props.extraPlaceholder || ""}
					style={props.style}
					below={props.below}
				/>
			)
		})
	}

	_onHourPress = date => {
		const hours = getHoursDiff(
			date,
			this.state.duration || this.state.defaultDuration
		)
		this.setState({
			hour: hours["start"] + " - " + hours["end"],
			dateAndTime: moment.utc(date).format(API_DATE_FORMAT)
		})
	}

	renderHours = () => {
		return this.state.hours.map((hours, index) => {
			let selected = false
			let selectedTextStyle
			if (
				this.state.dateAndTime ==
				moment.utc(hours[0]).format(API_DATE_FORMAT)
			) {
				selected = true
				selectedTextStyle = { color: "#fff" }
			}
			return (
				<InputSelectionButton
					selected={selected}
					key={`hours${index}`}
					onPress={() => this._onHourPress(hours[0])}
				>
					<Hours
						style={{
							...styles.hoursText,
							...selectedTextStyle
						}}
						date={hours[0]}
						duration={
							this.state.duration || this.state.defaultDuration
						}
					/>
				</InputSelectionButton>
			)
		})
	}

	_onStudentPress = student => {
		this.setState(
			{
				student,
				studentName: student.user.name
			},
			() => {
				this._getTopics()
			}
		)
	}

	renderStudents = () => {
		return this.state.students.map((student, index) => {
			let selected = false
			let selectedTextStyle
			if (this.state.student == student) {
				selected = true
				selectedTextStyle = { color: "#fff" }
			}
			return (
				<InputSelectionButton
					selected={selected}
					key={`student${index}`}
					onPress={() => this._onStudentPress(student)}
				>
					<Text
						style={{
							...styles.hoursText,
							...selectedTextStyle
						}}
					>
						{student.user.name}
					</Text>
				</InputSelectionButton>
			)
		})
	}

	submit = async () => {
		let lessonId = ""
		if (this.state.lesson) lessonId = this.state.lesson.id
		let student = {}
		if (this.state.student)
			student = { student_id: this.state.student.student_id }
		const resp = await this.props.dispatch(
			fetchOrError("/lessons/" + lessonId, {
				method: "POST",
				body: JSON.stringify({
					date: moment.utc(this.state.dateAndTime).toISOString(),
					meetup_place: this.state.meetup,
					dropoff_place: this.state.dropoff,
					...student
				})
			})
		)
		if (!lessonId) lessonId = resp.json["data"]["id"]
		let topicsResp = true
		if (this.state.progress.length > 0 || this.state.finished.length > 0) {
			topicsResp = await this.props.dispatch(
				fetchOrError(`/lessons/${lessonId}/topics`, {
					method: "POST",
					body: JSON.stringify({
						topics: {
							progress: this.state.progress,
							finished: this.state.finished
						}
					})
				})
			)
		}
		if (resp && topicsResp) {
			this.setState({ error: "", slidingMessageVisible: true }, () => {
				setTimeout(
					() => this.props.navigation.goBack(),
					DEFAULT_MESSAGE_TIME
				)
			})
		}
	}

	_onTopicPress = topic => {
		if (this.state.progress.includes(topic.id)) {
			// this is a second click, let's push it to finished and remove from progress
			const popFromProgress = this.state.progress.filter(
				(v, i) => v != topic.id
			)
			this.setState({
				finished: [...this.state.finished, topic.id],
				progress: popFromProgress
			})
		} else if (this.state.finished.includes(topic.id)) {
			// this is a third click, remove it from finished
			const popFromFinished = this.state.finished.filter(
				(v, i) => v != topic.id
			)
			this.setState({
				finished: popFromFinished
			})
		} else {
			// first click, push to progress
			this.setState({
				progress: [...this.state.progress, topic.id]
			})
		}
	}

	renderTopics = () => {
		return this.state.allTopics.map((topic, index) => {
			let selected = false
			let secondTimeSelected = false
			let selectedTextStyle
			if (this.state.progress.includes(topic.id)) {
				selected = true
				selectedTextStyle = { color: "#fff" }
			} else if (this.state.finished.includes(topic.id)) {
				secondTimeSelected = true
				selectedTextStyle = { color: "#fff" }
			}
			return (
				<InputSelectionButton
					selected={selected}
					secondTimeSelected={secondTimeSelected}
					key={`student${index}`}
					onPress={() => this._onTopicPress(topic)}
				>
					<Text
						style={{
							...styles.hoursText,
							...selectedTextStyle
						}}
					>
						{topic.title}
					</Text>
				</InputSelectionButton>
			)
		})
	}

	_getTopics = async () => {
		const url = this.buildTopicsUrl()
		if (!url) return
		const resp = await this.props.fetchService.fetch(url, { method: "GET" })
		this.setState({
			allTopics: resp.json["data"]
		})
	}

	buildTopicsUrl = () => {
		if (!this.state.lesson || !this.state.student) return
		let url = "/lessons"
		if (this.state.lesson) {
			return url + `/${this.state.lesson.id}/topics`
		} else if (this.state.student) {
			return url + `/0/topics?student_id=${this.state.student.student_id}`
		}

		return null
	}

	render() {
		return (
			<View style={{ flex: 1, marginTop: 20 }}>
				<SlidingMessage
					visible={this.state.slidingMessageVisible}
					error={this.state.error}
					success={strings("teacher.new_lesson.success")}
					close={() =>
						this.setState({ slidingMessageVisible: false })
					}
				/>
				<View style={styles.headerRow}>
					<Button
						icon={<Icon name="arrow-forward" type="material" />}
						onPress={() => {
							this.props.navigation.goBack()
						}}
						type="clear"
					/>
					<PageTitle
						style={styles.title}
						title={strings("teacher.new_lesson.title")}
					/>
				</View>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : null}
					keyboardVerticalOffset={62}
					style={styles.container}
				>
					<ScrollView
						ref={ref => (this._scrollView = ref)}
						style={styles.formContainer}
						keyboardDismissMode={
							Platform.OS === "ios" ? "interactive" : "on-drag"
						}
						keyboardShouldPersistTaps="handled"
					>
						{this.renderInputs()}
						<View style={styles.topics}>
							<Text style={styles.titleInForm}>
								{strings("teacher.new_lesson.topics")}
							</Text>
							{this.renderTopics()}
						</View>
					</ScrollView>
					<TouchableHighlight
						underlayColor="#ffffff00"
						ref={touchable => (this._touchable = touchable)}
						onPress={this.submit}
					>
						<View testID="finishButton" style={styles.submitButton}>
							<Text style={styles.doneText}>
								{strings("teacher.new_lesson.done")}
							</Text>
						</View>
					</TouchableHighlight>
				</KeyboardAvoidingView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	title: {
		marginLeft: 12,
		marginTop: 5
	},
	headerRow: {
		flexDirection: "row",
		flex: 1,
		maxHeight: 50,
		paddingLeft: MAIN_PADDING
	},
	selectedDateView: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		marginRight: MAIN_PADDING,
		marginTop: -10
	},
	selectedDate: {
		marginLeft: 6,
		fontSize: 14,
		fontWeight: "bold"
	},
	formContainer: {
		width: 340,
		marginBottom: 70,
		alignSelf: "center"
	},
	submitButton: fullButton,
	doneText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 20
	},
	inputContainer: {
		borderBottomColor: "rgb(200,200,200)",
		borderBottomWidth: 1,
		paddingBottom: 8,
		marginTop: 24
	},
	input: {
		paddingLeft: 12
	},
	hoursText: {
		color: "gray"
	},
	titleInForm: {
		alignSelf: "flex-start",
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 12
	},
	topics: {
		marginLeft: MAIN_PADDING
	}
})

function mapStateToProps(state) {
	return {
		fetchService: state.fetchService,
		user: state.user
	}
}
export default connect(mapStateToProps)(Lesson)
