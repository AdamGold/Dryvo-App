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
	DISPLAY_SHORT_DATE_FORMAT,
	GOOGLE_MAPS_QUERY,
	autoCompletePlacesStyle
} from "../../consts"
import Hours from "../../components/Hours"
import InputSelectionButton from "../../components/InputSelectionButton"
import moment from "moment"
import { getHoursDiff, Analytics } from "../../actions/utils"
import DateTimePicker from "react-native-modal-datetime-picker"
import { fetchOrError } from "../../actions/utils"
import SuccessModal from "../../components/SuccessModal"
import { Icon } from "react-native-elements"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import AlertError from "../../components/AlertError"

export class Lesson extends AlertError {
	constructor(props) {
		super(props)
		this.initState = {
			hours: [],
			dateAndTime: "",
			meetup: {},
			dropoff: {},
			meetupListViewDisplayed: false,
			dropoffListViewDisplayed: false
		}
		this.state = {
			date: "",
			datePickerVisible: false,
			successVisible: false,
			...this.initState
		}
		this._onHourPress = this._onHourPress.bind(this)
		this.createLesson = this.createLesson.bind(this)
		this._handleDatePicked = this._handleDatePicked.bind(this)

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
				dateAndTime: moment.utc(lesson.date).format(API_DATE_FORMAT),
				date: moment
					.utc(lesson.date)
					.local()
					.format(SHORT_API_DATE_FORMAT),
				duration: lesson.duration.toString(),
				meetup: { description: lesson.meetup_place },
				dropoff: { description: lesson.dropoff_place },
				hours: [[lesson.date, null]],
				hour: moment
					.utc(lesson.date)
					.local()
					.format("HH:mm")
			}
			await this._getAvailableHours(true)
		}
	}

	handlePlaceSelection = (name, data) => {
		const mainText = data.structured_formatting.main_text
		const placeID = data.place_id
		this.setState({
			[name + "ListViewDisplayed"]: false,
			[name]: {
				description: mainText,
				google_id: placeID
			}
		})
	}

	renderPlaces = () => {
		const places = ["meetup", "dropoff"]

		return places.map((name, index) => {
			return (
				<GooglePlacesAutocomplete
					key={`autocomplete-${name}`}
					query={GOOGLE_MAPS_QUERY}
					placeholder={strings("teacher.new_lesson." + name)}
					minLength={2}
					autoFocus={false}
					returnKeyType={"default"}
					fetchDetails={false}
					currentLocation={false}
					currentLocationLabel={strings("current_location")}
					nearbyPlacesAPI="GooglePlacesSearch"
					listViewDisplayed={this.state[name + "ListViewDisplayed"]}
					styles={autoCompletePlacesStyle}
					onPress={(data, details = null) => {
						// 'details' is provided when fetchDetails = true
						this.handlePlaceSelection(name, data)
					}}
					getDefaultValue={() => this.state[name].description || ""}
				/>
			)
		})
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

	deleteConfirm() {
		Alert.alert(strings("are_you_sure"), strings("are_you_sure_delete"), [
			{
				text: strings("cancel"),
				style: "cancel"
			},
			{
				text: strings("ok"),
				onPress: () => {
					this.delete()
				}
			}
		])
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
		let noDuplicates = []
		return this.state.hours.map((hours, index) => {
			if (noDuplicates.includes(hours[0])) {
				return <View />
			}
			noDuplicates.push(hours[0])
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
			Analytics.logEvent("student_created_lesson")
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
		let backButton, deleteButton
		if (this.state.lesson) {
			backButton = (
				<TouchableOpacity
					onPress={() => {
						this.props.navigation.goBack()
					}}
					style={styles.backButton}
				>
					<Icon name="arrow-forward" type="material" />
				</TouchableOpacity>
			)
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
						this.props.navigation.goBack()
					}}
					button={strings("student.new_lesson.success_button")}
				/>
				<ScrollView
					ref={ref => (this._scrollView = ref)}
					style={styles.formContainer}
					keyboardDismissMode={
						Platform.OS === "ios" ? "interactive" : "on-drag"
					}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.headerRow}>
						{backButton}
						<PageTitle
							style={styles.title}
							title={strings("teacher.new_lesson.title")}
						/>
						{deleteButton}
					</View>
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
					{this.renderPlaces()}
				</ScrollView>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : null}
					keyboardVerticalOffset={Platform.select({
						ios: fullButton.height,
						android: null
					})}
				>
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
		alignSelf: "center"
	},
	submitButton: { ...fullButton, position: "relative" },
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
	},
	backButton: {
		marginTop: 8
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
