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
import { MAIN_PADDING } from "../../consts"
import NewLessonInput from "../../components/NewLessonInput"
import Hours from "../../components/Hours"

class NewLesson extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			date: this.props.navigation.getParam("date"),
			error: "",
			hours: [],
			students: [],
			dateAndTime: ""
		}
		this.inputs = {
			date: {
				iconName: "date-range",
				editable: false,
				selectTextOnFocus: false,
				style: {
					borderBottomWidth: 0
				}
			},
			duration: {
				iconName: "swap-horiz",
				extraPlaceholder: ` (${strings(
					"teacher.new_lesson.default"
				)}: ${this.props.user.lesson_duration.toString()})`,
				onBlur: input => {
					this._getAvailableHours()
					this.onBlur(input)
				}
			},
			studentName: {
				iconName: "person-outline",
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
			}
		}
		Object.keys(this.inputs).forEach(input => {
			if (!this.state[input]) {
				this.state[input] = ""
			}
		})
		this.setRef = this.setRef.bind(this)
		this.onChangeText = this.onChangeText.bind(this)
		this._onHourPress = this._onHourPress.bind(this)

		this._getAvailableHours()
	}

	_getAvailableHours = async () => {
		console.log(this.state.duration)
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
		const resp = await this.props.fetchService.fetch(
			"/teacher/students?name=" + name,
			{
				method: "GET"
			}
		)
		let names = []
		Object.entries(resp.json["data"]).map(([key, value]) => {
			names.push(value.user.name)
		})
		this.setState({
			students: names
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
				/>
			)
		})
	}

	_onHourPress = date => {
		this.setState({
			dateAndTime: date
		})
	}

	renderHours = () => {
		return this.state.hours.map((hours, index) => {
			return (
				<TouchableHighlight
					key={`hours${index}`}
					onPress={() => this._onHourPress(hours[0])}
				>
					<View style={styles.hours}>
						<Hours
							style={styles.hoursText}
							date={hours[0]}
							duration={this.state.duration}
						/>
					</View>
				</TouchableHighlight>
			)
		})
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
				</View>
				<KeyboardAvoidingView
					behavior="padding"
					keyboardVerticalOffset={62}
					style={styles.container}
				>
					<ScrollView
						ref={ref => (this._scrollView = ref)}
						style={styles.formContainer}
					>
						<Text testID="error">{this.state.error}</Text>
						{this.renderInputs()}
						<Text style={styles.hoursTitle}>
							{strings("teacher.new_lesson.hour")}
						</Text>
						<View style={styles.hoursRows}>
							{this.renderHours()}
						</View>
					</ScrollView>
					<TouchableHighlight
						underlayColor="#ffffff00"
						ref={touchable => (this._touchable = touchable)}
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
		flex: 1,
		marginTop: -20
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
		maxWidth: 340,
		alignSelf: "center"
	},
	submitButton: {
		position: "absolute",
		bottom: 0,
		backgroundColor: "rgb(12,116,244)",
		height: 56,
		width: "100%",
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center"
	},
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
	hoursRows: {
		flex: 1,
		flexWrap: "wrap",
		flexDirection: "row",
		justifyContent: "flex-start"
	},
	hours: {
		padding: 8
	},
	hoursText: {
		fontWeight: "bold"
	},
	hoursTitle: {
		fontWeight: "bold",
		alignSelf: "flex-start",
		marginTop: 16,
		marginBottom: 8,
		fontSize: 18
	}
})

mapStateToProps = state => {
	return {
		fetchService: state.fetchService,
		user: state.user
	}
}
export default connect(mapStateToProps)(NewLesson)
