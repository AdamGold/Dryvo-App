import React, { Fragment } from "react"
import {
	KeyboardAvoidingView,
	Text,
	StyleSheet,
	View,
	TouchableOpacity,
	ScrollView,
	Platform
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
	DISPLAY_SHORT_DATE_FORMAT,
	DISPLAY_LONG_DATE_FORMAT
} from "../../consts"
import NewLessonInput from "../../components/NewLessonInput"
import InputSelectionButton from "../../components/InputSelectionButton"
import moment from "moment"
import { getHoursDiff, fetchOrError, Analytics } from "../../actions/utils"
import { getLessonById } from "../../actions/lessons"
import SuccessModal from "../../components/SuccessModal"
import DateTimePicker from "react-native-modal-datetime-picker"
import LessonParent from "../LessonParent"
import { Dropdown } from "react-native-material-dropdown"
import Hours from "../../components/Hours"

const typeMulOptions = [
	{ value: "lesson", label: strings("teacher.new_lesson.types.lesson") },
	{
		value: "inner_exam",
		label: strings("teacher.new_lesson.types.inner_exam")
	},
	{ value: "test", label: strings("teacher.new_lesson.types.test") }
]

export class Lesson extends LessonParent {
	constructor(props) {
		super(props)
		this.duration = props.user.lesson_duration || DEFAULT_DURATION
		this.state = {
			date: new Date(props.navigation.getParam("date")),
			students: [],
			student: {},
			allTopics: [],
			progress: [],
			finished: [],
			successVisible: false,
			datePickerVisible: false,
			price: this.props.user.price,
			meetup: {},
			dropoff: {},
			meetupListViewDisplayed: false,
			dropoffListViewDisplayed: false,
			duration_mul: 1,
			duration: this.duration,
			type: "lesson",
			hours: []
		}
		this._initializeInputs = this._initializeInputs.bind(this)
		this.onChangeText = this.onChangeText.bind(this)
		this._onStudentPress = this._onStudentPress.bind(this)
		this.submit = this.submit.bind(this)
		this._onHourPress = this._onHourPress.bind(this)

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
			// init duration, studentName, meetup, dropoff,
			this.state = {
				...this.state,
				lesson,
				student: lesson.student,
				price: lesson.price,
				date: moment.utc(lesson.date).local(),
				studentName: lesson.student.name,
				meetup: { description: lesson.meetup_place },
				dropoff: { description: lesson.dropoff_place },
				type: lesson.type,
				duration_mul: lesson.duration / this.duration,
				duration: lesson.duration,
				hours: [[lesson.date, null]]
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
			studentName: {
				iconName: "person-outline",
				onChangeText: (name, value) => {
					this.onChangeText(name, value)
					this._getStudents(value)
				},
				...studentEditable
			},
			duration: {
				iconName: "clock",
				iconType: "feather",
				onChangeText: (name, value) => {
					if (!value) value = 0
					else value = parseInt(value)
					this.setState({ duration: value })
				},
				onBlur: input => {
					this.onBlur(input)
					this.setState(
						{
							duration_mul: this.state.duration / this.duration
						},
						() => {
							this.calculatePrice()
						}
					)
				}
			},
			price: {
				iconName: "dollar-sign",
				iconType: "feather",
				onFocus: input => {
					this.onFocus(input)
					this._scrollView.scrollToEnd()
				}
			}
		}

		Object.keys(this.inputs).forEach(input => {
			if (!this.state[input]) {
				this.state[input] = ""
			}
		})
	}

	_getStudents = async (name = "") => {
		if (name.length < 2) return
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

	renderInputs = (start = 0, end = 1) => {
		const keys = Object.keys(this.inputs).slice(start, end)
		return keys.map((name, index) => {
			const props = this.inputs[name]
			return (
				<NewLessonInput
					key={`key${index}`}
					name={name}
					editable={props.editable}
					selectTextOnFocus={props.selectTextOnFocus}
					autoFocus={props.autoFocus}
					onFocus={props.onFocus || this.onFocus}
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

	calculatePrice() {
		if (this.state.hasOwnProperty("price") && this.state.duration_mul) {
			let newPrice = this.props.user.price * this.state.duration_mul
			if (Object.keys(this.state.student).length > 0) {
				newPrice = this.state.student.price * this.state.duration_mul
			}
			this.setState({ price: newPrice })
		}
	}

	_onStudentPress = student => {
		this.setState(
			{
				student,
				price: student.price,
				studentName: student.name
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
						{student.name}
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
			fetchOrError("/appointments/" + lessonId, {
				method: "POST",
				body: JSON.stringify({
					date: moment(this.state.date)
						.utc()
						.toISOString(),
					price: this.state.price,
					meetup_place: this.state.meetup,
					dropoff_place: this.state.dropoff,
					duration: this.state.duration,
					type: this.state.type,
					...student
				})
			})
		)
		if (!resp) return
		if (!lessonId) lessonId = resp.json["data"]["id"]
		let topicsResp = true
		if (
			(this.state.progress.length > 0 ||
				this.state.finished.length > 0) &&
			this.state.type == "lesson"
		) {
			topicsResp = await this.props.dispatch(
				fetchOrError(`/appointments/${lessonId}/topics`, {
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
			Analytics.logEvent("teacher_created_" + this.state.type)
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
					selectedColor="#d6a40d"
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
		let url = "/appointments"
		if (this.state.lesson) {
			return url + `/${this.state.lesson.id}/topics`
		} else if (this.state.student && this.state.student.student_id) {
			return url + `/0/topics?student_id=${this.state.student.student_id}`
		}

		return null
	}

	_typeChange = (value, index, data) => {
		this.setState({
			type: value
		})
	}

	renderType = () => {
		return (
			<Dropdown
				value={this.state.type}
				data={typeMulOptions}
				onChangeText={this._typeChange.bind(this)}
				dropdownMargins={{ min: 20, max: 60 }}
				dropdownOffset={{
					top: 0,
					left: 0
				}}
				containerStyle={{
					marginLeft: MAIN_PADDING,
					marginRight: MAIN_PADDING,
					marginTop: 8
				}}
				inputContainerStyle={{
					borderBottomColor: "transparent"
				}}
			/>
		)
	}

	_onHourPress = date => {
		this.setState({
			date: moment.utc(date).local()
		})
	}

	renderHours = () => {
		let noDuplicates = []
		return this.state.hours.map((hours, index) => {
			if (noDuplicates.includes(hours[0])) {
				return <View />
			}
			noDuplicates.push(hours[0])
			return (
				<InputSelectionButton
					key={`hours${index}`}
					onPress={() => this._onHourPress(hours[0])}
				>
					<Hours date={hours[0]} duration={this.state.duration} />
				</InputSelectionButton>
			)
		})
	}

	_getAvailableHours = async (append = false) => {
		if (!this.state.date) return
		const resp = await this.props.fetchService.fetch(
			`/teacher/${this.props.user.teacher_id}/available_hours`,
			{
				method: "POST",
				body: JSON.stringify({
					date: moment(this.state.date).format(SHORT_API_DATE_FORMAT),
					duration: this.state.duration
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

	render() {
		let date = moment(this.state.date).format(DISPLAY_LONG_DATE_FORMAT)
		let desc = strings("teacher.new_lesson.success_desc_with_student", {
			student: this.state.studentName,
			date,
			type: strings("teacher.new_lesson.types." + this.state.type)
		})
		if (this.state.studentName == "") {
			desc = strings("teacher.new_lesson.success_desc_without_student", {
				date,
				type: strings("teacher.new_lesson.types." + this.state.type)
			})
		}

		const fourMonthsAway = moment()
			.add(4, "months")
			.toDate()

		let deleteButton
		if (this.state.lesson) {
			deleteButton = (
				<TouchableOpacity
					onPress={this.deleteConfirm.bind(this)}
					style={styles.deleteButton}
				>
					<Text style={{ color: "red" }}>
						{strings("delete_lesson")}
					</Text>
				</TouchableOpacity>
			)
		}
		let price
		let topics
		if (this.state.type == "lesson") {
			topics = (
				<Fragment>
					<View style={styles.nonInputContainer}>
						<Text style={styles.nonInputTitle}>
							{strings("teacher.new_lesson.topics")}
						</Text>
					</View>
					<View style={styles.rects}>{this.renderTopics()}</View>
				</Fragment>
			)
			price = this.renderInputs(2, 3)
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
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : null}
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
						<View style={styles.headerRow}>
							<Button
								icon={
									<Icon
										name="arrow-forward"
										type="material"
									/>
								}
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
						<TouchableOpacity onPress={this._showDateTimePicker}>
							<View style={styles.nonInputContainer}>
								<Text style={styles.nonInputTitle}>
									{strings(
										"teacher.new_lesson.date_and_hour"
									)}
								</Text>
								<Text>{date}</Text>
							</View>
						</TouchableOpacity>
						<View style={styles.rects}>{this.renderHours()}</View>
						{this.renderInputs(0, 1)}
						<View style={styles.nonInputContainer}>
							<Text style={styles.nonInputTitle}>
								{strings("teacher.new_lesson.duration_title")}
							</Text>
						</View>
						{this.renderDuration()}
						{this.renderInputs(1, 2)}
						<View style={styles.nonInputContainer}>
							<Text style={styles.nonInputTitle}>
								{strings("teacher.new_lesson.type")}
							</Text>
						</View>
						{this.renderType()}
						{price}
						<View style={styles.nonInputContainer}>
							<Text style={styles.nonInputTitle}>
								{strings("teacher.new_lesson.places")}
							</Text>
						</View>
						{this.renderPlaces()}
						{topics}
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
					mode="datetime"
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
		marginLeft: 6,
		marginTop: 5
	},
	headerRow: {
		flexDirection: "row",
		flex: 1,
		maxHeight: 50
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
		alignSelf: "center",
		marginBottom: 10
	},
	submitButton: { ...fullButton, position: "relative" },
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
		color: "gray",
		textAlign: "center"
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
		error: state.error
	}
}
export default connect(mapStateToProps)(Lesson)
