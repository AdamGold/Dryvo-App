import React from "react"
import {
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	Text,
	StyleSheet,
	View,
	TouchableHighlight,
	ScrollView
} from "react-native"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import {
	MAIN_PADDING,
	floatButton,
	API_DATE_FORMAT,
	SHORT_API_DATE_FORMAT
} from "../../consts"
import NewLessonInput from "../../components/NewLessonInput"
import Hours from "../../components/Hours"
import InputSelectionButton from "../../components/InputSelectionButton"
import moment from "moment"
import { getHoursDiff } from "../../actions/utils"
import { API_ERROR } from "../../reducers/consts"
import DateTimePicker from "react-native-modal-datetime-picker"

export class Lesson extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			date: "",
			error: "",
			hours: [],
			dateAndTime: "",
			lesson: null,
			datePickerVisible: false
		}
		this._initializeInputs = this._initializeInputs.bind(this)
		this.setRef = this.setRef.bind(this)
		this.onChangeText = this.onChangeText.bind(this)
		this._onHourPress = this._onHourPress.bind(this)
		this.createLesson = this.createLesson.bind(this)
		this._handleDatePicked = this._handleDatePicked.bind(this)

		this._initializeInputs()
	}

	_initializeInputs = () => {
		this.inputs = {
			date: {
				iconName: "date-range",
				onFocus: () => {
					this._showDateTimePicker()
				}
			},
			hour: {
				iconName: "access-time",
				below: this.renderHours,
				editable: false,
				selectTextOnFocus: false
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

	_getAvailableHours = async () => {
		const resp = await this.props.fetchService.fetch(
			`/teacher/${this.props.user.my_teacher.teacher_id}/available_hours`,
			{
				method: "POST",
				body: JSON.stringify({
					date: this.state.date
				})
			}
		)
		this.setState({
			hours: resp.json["data"]
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
					onFocus={props.onFocus || this.onFocus}
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
			this.props.user.my_teacher.lesson_duration
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
						duration={this.props.user.my_teacher.lesson_duration}
					/>
				</InputSelectionButton>
			)
		})
	}

	createLesson = async () => {
		try {
			const resp = await this.props.fetchService.fetch("/lessons/", {
				method: "POST",
				body: JSON.stringify({
					date: moment.utc(this.state.dateAndTime).toISOString(),
					meetup_place: this.state.meetup,
					dropoff_place: this.state.dropoff
				})
			})
		} catch (error) {
			let msg = ""
			console.log(error)
			if (error && error.hasOwnProperty("message")) msg = error.message
			this.props.dispatch({ type: API_ERROR, error: msg })
		}
	}

	_showDateTimePicker = () => this.setState({ datePickerVisible: true })

	_hideDateTimePicker = () => this.setState({ datePickerVisible: false })

	_handleDatePicked = date => {
		this._hideDateTimePicker()
		this.setState(
			{ date: moment.utc(date).format(SHORT_API_DATE_FORMAT) },
			() => {
				this._getAvailableHours()
			}
		)
	}

	render() {
		return (
			<View style={{ flex: 1, marginTop: 20 }}>
				<View style={styles.headerRow}>
					<PageTitle
						style={styles.title}
						title={strings("teacher.new_lesson.title")}
					/>
				</View>
				<KeyboardAvoidingView
					behavior="padding"
					keyboardVerticalOffset={62}
					style={styles.container}
				>
					<ScrollView
						ref={ref => (this._scrollView = ref)}
						style={styles.formContainer}
						keyboardDismissMode="on-drag"
						keyboardShouldPersistTaps="always"
					>
						<Text testID="error">{this.state.error}</Text>
						{this.renderInputs()}
					</ScrollView>
					<TouchableHighlight
						underlayColor="#ffffff00"
						ref={touchable => (this._touchable = touchable)}
						onPress={this.createLesson}
					>
						<View testID="finishButton" style={styles.submitButton}>
							<Text style={styles.doneText}>
								{strings("student.new_lesson.done")}
							</Text>
						</View>
					</TouchableHighlight>
				</KeyboardAvoidingView>
				<DateTimePicker
					isVisible={this.state.datePickerVisible}
					onConfirm={this._handleDatePicked}
					onCancel={this._hideDateTimePicker}
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
	submitButton: floatButton,
	doneText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 20
	},
	hoursText: {
		color: "gray"
	}
})

function mapStateToProps(state) {
	return {
		fetchService: state.fetchService,
		user: state.user
	}
}
export default connect(mapStateToProps)(Lesson)
