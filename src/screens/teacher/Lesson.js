import React from "react"
import {
	KeyboardAvoidingView,
	Text,
	StyleSheet,
	View,
	TouchableHighlight,
	TouchableOpacity,
	ScrollView,
	Platform,
	Alert
} from "react-native"
import { connect } from "react-redux"
import { Button, Icon } from "react-native-elements"
import { strings, errors } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import {
	MAIN_PADDING,
	fullButton,
	API_DATE_FORMAT,
	DEFAULT_DURATION,
	SHORT_API_DATE_FORMAT,
	DISPLAY_SHORT_DATE_FORMAT
} from "../../consts"
import NewLessonInput from "../../components/NewLessonInput"
import Hours from "../../components/Hours"
import InputSelectionButton from "../../components/InputSelectionButton"
import moment from "moment"
import { API_ERROR } from "../../reducers/consts"
import { getHoursDiff, fetchOrError, popLatestError } from "../../actions/utils"
import { getLessonById } from "../../actions/lessons"
import SuccessModal from "../../components/SuccessModal"
import DateTimePicker from "react-native-modal-datetime-picker"
import Analytics from "appcenter-analytics"

export class Lesson extends React.Component {
	constructor(props) {
		super(props)
		const duration = props.user.lesson_duration || DEFAULT_DURATION
		this.state = {
			date: props.navigation.getParam("date"),
			hours: [],
			students: [],
			student: {},
			dateAndTime: "",
			defaultDuration: duration.toString(),
			allTopics: [],
			progress: [],
			finished: [],
			successVisible: false,
			datePickerVisible: false
		}
		this._initializeInputs = this._initializeInputs.bind(this)
		this.onChangeText = this.onChangeText.bind(this)
		this._onHourPress = this._onHourPress.bind(this)
		this._onStudentPress = this._onStudentPress.bind(this)
		this.submit = this.submit.bind(this)

		this._initializeExistingLesson()
		this._initializeInputs()
		this._getAvailableHours(true)
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
				date: moment
					.utc(lesson.date)
					.local()
					.format(SHORT_API_DATE_FORMAT),
				dateAndTime: moment.utc(lesson.date).format(API_DATE_FORMAT),
				studentName: lesson.student.user.name,
				duration: lesson.duration.toString(),
				meetup: (lesson.meetup_place || {}).name,
				dropoff: (lesson.dropoff_place || {}).name,
				hours: [[lesson.date, null]],
				hour: moment
					.utc(lesson.date)
					.local()
					.format("HH:mm")
			}
		}
		await this._getTopics()
	}

	_initializeInputs = () => {
		let studentEditable = { below: this.renderStudents }
		if (this.state.lesson) {
			studentEditable = { editable: false, selectTextOnFocus: false }
		}
		this.inputs = {
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
			studentName: {
				iconName: "person-outline",
				onChangeText: (name, value) => {
					this.onChangeText(name, value)
					this._getStudents(value)
				},
				...studentEditable
			},
			meetup: {
				iconName: "navigation",
				iconType: "feather"
			},
			dropoff: {
				iconName: "map-pin",
				iconType: "feather"
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
			Alert.alert(strings("errors.title"), errors(error))
		}
	}

	_showDateTimePicker = () => this.setState({ datePickerVisible: true })

	_hideDateTimePicker = () => this.setState({ datePickerVisible: false })

	_handleDatePicked = date => {
		this._hideDateTimePicker()
		this.setState(
			{ date: moment(date).format(SHORT_API_DATE_FORMAT) },
			() => {
				this._getAvailableHours()
			}
		)
	}

	_getAvailableHours = async (append = false) => {
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
		let hours = resp.json.data
		if (append) {
			// we're appending available hours to the current hour of the edited lesson
			hours = [...this.state.hours, ...resp.json.data]
		}
		this.setState({
			hours: hours
		})
	}

	_getStudents = async (name = "") => {
		if (name.length < 1) return
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

	renderInputs = () => {
		const keys = Object.keys(this.inputs)
		return keys.map((name, index) => {
			const props = this.inputs[name]
			return (
				<NewLessonInput
					key={`key${index}`}
					name={name}
					editable={props.editable}
					selectTextOnFocus={props.selectTextOnFocus}
					autoFocus={props.autoFocus}
					onFocus={this.onFocus}
					onBlur={props.onBlur || this.onBlur}
					onChangeText={props.onChangeText || this.onChangeText}
					iconName={props.iconName}
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
		this._scrollView.scrollToEnd()
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
		if (this.state.hours.length == 0) {
			return (
				<Text>{strings("student.new_lesson.no_hours_available")}</Text>
			)
		}
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

	delete = async () => {
		const { lesson } = this.state
		if (!lesson) return
		const resp = await this.props.fetchService.fetch(
			`/lessons/${lesson.id}`,
			{
				method: "DELETE"
			}
		)
		if (resp) {
			Alert.alert(strings("teacher.notifications.lessons_deleted"))
			this.props.navigation.goBack()
		}
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
		if (this.state.students.length == 0) {
			if (this.state.studentName) {
				return (
					<Text>{strings("teacher.new_lesson.empty_students")}</Text>
				)
			}
			return (
				<Text>{strings("teacher.new_lesson.enter_student_name")}</Text>
			)
		}
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
		if (!resp) return
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
		if (topicsResp) {
			Analytics.trackEvent("Teacher lesson created", {
				Category: "Lesson",
				date: moment.utc(this.state.dateAndTime).toISOString(),
				studentName: this.state.studentName,
				respFromServer: JSON.stringify(resp.json)
			})
			this.setState({ successVisible: true })
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
		if (this.state.allTopics.length == 0) {
			if (this.state.studentName) {
				return <Text>{strings("teacher.new_lesson.empty_topics")}</Text>
			}
			return (
				<Text>{strings("teacher.new_lesson.enter_student_name")}</Text>
			)
		}
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
			allTopics: resp.json["available"],
			progress: resp.json["progress"],
			finished: resp.json["finished"]
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
		let date = moment(this.state.date).format(DISPLAY_SHORT_DATE_FORMAT)
		let desc = strings("teacher.new_lesson.success_desc_with_student", {
			student: this.state.studentName,
			hours: this.state.hour,
			date
		})
		if (this.state.studentName == "") {
			desc = strings("teacher.new_lesson.success_desc_without_student", {
				hours: this.state.hour,
				date
			})
		}

		const fourMonthsAway = moment()
			.add(4, "months")
			.toDate()

		let deleteButton
		if (this.state.lesson) {
			deleteButton = (
				<TouchableOpacity
					onPress={this.delete.bind(this)}
					style={styles.deleteButton}
				>
					<Text style={{ color: "red" }}>
						{strings("delete_lesson")}
					</Text>
				</TouchableOpacity>
			)
		}

		return (
			<View style={{ flex: 1, marginTop: 20 }}>
				<SuccessModal
					visible={this.state.successVisible}
					image="lesson"
					title={strings("teacher.new_lesson.success_title")}
					desc={desc}
					buttonPress={() => {
						this.setState({ successVisible: false })
						this.props.navigation.goBack()
					}}
					button={strings("teacher.new_lesson.success_button")}
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
					{deleteButton}
				</View>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "position" : null}
					keyboardVerticalOffset={Platform.select({
						ios: fullButton.height,
						android: null
					})}
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
						<TouchableOpacity onPress={this._showDateTimePicker}>
							<View style={styles.nonInputContainer}>
								<Text style={styles.nonInputTitle}>
									{strings("teacher.new_lesson.date")}
								</Text>
								<Text>{date}</Text>
							</View>
						</TouchableOpacity>
						<View style={styles.nonInputContainer}>
							<Text style={styles.nonInputTitle}>
								{strings("teacher.new_lesson.hour")}
							</Text>
						</View>
						<View style={styles.rects}>{this.renderHours()}</View>
						{this.renderInputs()}
						<View style={styles.nonInputContainer}>
							<Text style={styles.nonInputTitle}>
								{strings("teacher.new_lesson.topics")}
							</Text>
						</View>
						<View style={styles.rects}>{this.renderTopics()}</View>
					</ScrollView>
					<TouchableOpacity
						onPress={this.submit}
						style={styles.submitButton}
					>
						<Text style={styles.doneText}>
							{strings("teacher.new_lesson.done")}
						</Text>
					</TouchableOpacity>
				</KeyboardAvoidingView>
				<DateTimePicker
					isVisible={this.state.datePickerVisible}
					onConfirm={this._handleDatePicked}
					onCancel={this._hideDateTimePicker}
					maximumDate={fourMonthsAway}
				/>
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
	rects: {
		flex: 1,
		flexWrap: "wrap",
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: 12
	},
	nonInputContainer: {
		alignItems: "flex-start",
		marginLeft: MAIN_PADDING
	},
	nonInputTitle: {
		fontWeight: "bold",
		marginBottom: 8,
		marginTop: 12
	},
	deleteButton: {
		marginLeft: "auto",
		marginTop: 6,
		paddingRight: MAIN_PADDING
	}
})

function mapStateToProps(state) {
	return {
		fetchService: state.fetchService,
		user: state.user,
		errors: state.errors
	}
}
export default connect(mapStateToProps)(Lesson)
