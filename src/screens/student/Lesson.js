import React from "react"
import {
	KeyboardAvoidingView,
	Platform,
	Text,
	StyleSheet,
	View,
	TouchableOpacity,
	ScrollView,
	Alert
} from "react-native"
import { connect } from "react-redux"
import { strings, errors } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import {
	MAIN_PADDING,
	fullButton,
	API_DATE_FORMAT,
	SHORT_API_DATE_FORMAT,
	DISPLAY_SHORT_DATE_FORMAT
} from "../../consts"
import NewLessonInput from "../../components/NewLessonInput"
import Hours from "../../components/Hours"
import InputSelectionButton from "../../components/InputSelectionButton"
import moment from "moment"
import { getHoursDiff } from "../../actions/utils"
import { API_ERROR } from "../../reducers/consts"
import DateTimePicker from "react-native-modal-datetime-picker"
import { fetchOrError } from "../../actions/utils"
import { popLatestError } from "../../actions/utils"
import SuccessModal from "../../components/SuccessModal"
import Analytics from "appcenter-analytics"

export class Lesson extends React.Component {
	constructor(props) {
		super(props)
		this.initState = {
			hours: [],
			dateAndTime: ""
		}
		this.state = {
			date: "",
			datePickerVisible: false,
			successVisible: false,
			...this.initState
		}
		this._initializeInputs = this._initializeInputs.bind(this)
		this.onChangeText = this.onChangeText.bind(this)
		this._onHourPress = this._onHourPress.bind(this)
		this.createLesson = this.createLesson.bind(this)
		this._handleDatePicked = this._handleDatePicked.bind(this)

		this._initializeExistingLesson()
		this._initializeInputs()
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
				dateAndTime: moment.utc(lesson.date).format(API_DATE_FORMAT),
				date: moment
					.utc(lesson.date)
					.local()
					.format(SHORT_API_DATE_FORMAT),
				duration: lesson.duration.toString(),
				meetup: (lesson.meetup_place || {}).name,
				dropoff: (lesson.dropoff_place || {}).name,
				hours: [[lesson.date, null]],
				hour: moment
					.utc(lesson.date)
					.local()
					.format("HH:mm")
			}
			await this._getAvailableHours(true)
		}
	}
	_initializeInputs = (force = false) => {
		this.inputs = {
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
			if (!this.state[input] || force) {
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

	_getAvailableHours = async (append = false) => {
		const resp = await this.props.fetchService.fetch(
			`/teacher/${this.props.user.my_teacher.teacher_id}/available_hours`,
			{
				method: "POST",
				body: JSON.stringify({
					date: this.state.date
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
			const next = keys[index + 1]
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

	_onHourPress = date => {
		this._scrollView.scrollToEnd()
		const hours = getHoursDiff(
			date,
			this.props.user.my_teacher.lesson_duration
		)
		this.setState({
			hour: hours["start"] + " - " + hours["end"],
			dateAndTime: moment.utc(date).format(API_DATE_FORMAT)
		})
	}

	renderHours = () => {
		if (this.state.hours.length == 0) {
			if (this.state.date) {
				return (
					<Text>
						{strings("student.new_lesson.no_hours_available")}
					</Text>
				)
			}
			return (
				<Text>
					{strings("student.new_lesson.pick_date_before_hours")}
				</Text>
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
						duration={this.props.user.my_teacher.lesson_duration}
					/>
				</InputSelectionButton>
			)
		})
	}

	createLesson = async () => {
		let lessonId = ""
		if (this.state.lesson) lessonId = this.state.lesson.id
		const resp = await this.props.dispatch(
			fetchOrError("/lessons/" + lessonId, {
				method: "POST",
				body: JSON.stringify({
					date: moment.utc(this.state.dateAndTime).toISOString(),
					meetup_place: this.state.meetup,
					dropoff_place: this.state.dropoff
				})
			})
		)
		if (resp) {
			Analytics.trackEvent("Student lesson created", {
				Category: "Lesson",
				date: moment.utc(this.state.dateAndTime).toISOString(),
				respFromServer: JSON.stringify(resp.json)
			})
			this._initializeInputs(true)
			this.setState({ ...this.initState, successVisible: true })
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

	render() {
		let date = strings("student.new_lesson.pick_date")
		if (this.state.date) {
			date = moment(this.state.date).format(DISPLAY_SHORT_DATE_FORMAT)
		}
		const today = moment().toDate()
		const fourMonthsAway = moment()
			.add(4, "months")
			.toDate()

		return (
			<View style={{ flex: 1, marginTop: 20 }}>
				<SuccessModal
					visible={this.state.successVisible}
					image="lesson"
					title={strings("student.new_lesson.success_title")}
					desc={strings("student.new_lesson.success_desc", {
						hours: this.state.hour,
						date: this.state.date
					})}
					buttonPress={() => {
						this.setState({ successVisible: false })
						this.props.navigation.navigate("Schedule")
					}}
					button={strings("student.new_lesson.success_button")}
				/>
				<View style={styles.headerRow}>
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
						<View style={styles.hours}>{this.renderHours()}</View>
						{this.renderInputs()}
					</ScrollView>
					<TouchableOpacity
						ref={touchable => (this._touchable = touchable)}
						onPress={this.createLesson}
						style={styles.submitButton}
					>
						<Text style={styles.doneText}>
							{strings("student.new_lesson.done")}
						</Text>
					</TouchableOpacity>
				</KeyboardAvoidingView>
				<DateTimePicker
					isVisible={this.state.datePickerVisible}
					onConfirm={this._handleDatePicked}
					onCancel={this._hideDateTimePicker}
					minimumDate={today}
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
	formContainer: {
		width: 340,
		alignSelf: "center",
		marginBottom: 70
	},
	submitButton: fullButton,
	doneText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 20
	},
	hoursText: {
		color: "gray"
	},
	hours: {
		flex: 1,
		flexWrap: "wrap",
		flexDirection: "row",
		justifyContent: "center"
	},
	nonInputContainer: {
		alignItems: "flex-start",
		marginLeft: MAIN_PADDING
	},
	nonInputTitle: {
		fontWeight: "bold",
		marginBottom: 8,
		marginTop: 12
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
