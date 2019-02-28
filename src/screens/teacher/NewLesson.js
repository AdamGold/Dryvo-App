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
import { Input, Button, Icon } from "react-native-elements"
import { strings } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import { MAIN_PADDING, floatButton, API_DATE_FORMAT } from "../../consts"
import NewLessonInput from "../../components/NewLessonInput"
import Hours from "../../components/Hours"
import InputSelectionButton from "../../components/InputSelectionButton"
import moment from "moment"
import { getHoursDiff } from "../../actions/utils"
import { API_ERROR } from "../../reducers/consts"

class NewLesson extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			date: this.props.navigation.getParam("date"),
			error: "",
			hours: [],
			students: [],
			selectedStudent: {},
			dateAndTime: "",
			defaultDuration: this.props.user.lesson_duration.toString()
		}
		this._initializeInputs = this._initializeInputs.bind(this)
		this.setRef = this.setRef.bind(this)
		this.onChangeText = this.onChangeText.bind(this)
		this._onHourPress = this._onHourPress.bind(this)
		this._onStudentPress = this._onStudentPress.bind(this)
		this.createLesson = this.createLesson.bind(this)

		this._initializeInputs()
		this._getAvailableHours()
	}

	_initializeInputs = () => {
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
				below: this.renderStudents,
				onChangeText: (name, value) => {
					this.onChangeText(name, value)
					this._getStudents(value)
				}
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
			},
			hour: {
				iconName: "access-time",
				below: this.renderHours,
				editable: false,
				selectTextOnFocus: false
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
		this.setState({
			student,
			studentName: student.user.name
		})
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

	createLesson = async () => {
		try {
			const resp = await this.props.fetchService.fetch("/lessons/", {
				method: "POST",
				body: JSON.stringify({
					date: moment.utc(this.state.dateAndTime).toISOString(),
					student_id: this.state.student.student_id,
					meetup_place: this.state.meetup,
					dropoff_place: this.state.dropoff
				})
			})
			const lessonId = resp.json["data"]["id"]
			// TODO update topics
			/*
			const topicsResp = await this.props.fetchService.fetch(
				`/lessons/${lessonId}/topics`,
				{
					method: "POST",
					body: JSON.stringify({ topics: {progress: [], finished: []} })
				}
			) */
			this.props.navigation.goBack()
		} catch (error) {
			let msg = ""
			if (error && error.hasOwnProperty("message")) msg = error.message
			this.props.dispatch({ type: API_ERROR, error: msg })
		}
	}

	render() {
		return (
			<View style={{ flex: 1, marginTop: 20 }}>
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
					<View style={styles.selectedDateView}>
						<Icon type="material" name="date-range" />
						<Text style={styles.selectedDate}>
							{this.state.date}
						</Text>
					</View>
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
	submitButton: floatButton,
	doneText: {
		color: "#fff",
		fontWeight: "bold"
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
	}
})

mapStateToProps = state => {
	return {
		fetchService: state.fetchService,
		user: state.user
	}
}
export default connect(mapStateToProps)(NewLesson)
