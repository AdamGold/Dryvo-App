import React, { Fragment } from "react"
import {
	View,
	StyleSheet,
	Text,
	Platform,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	TextInput,
	Alert
} from "react-native"
import { connect } from "react-redux"
import { strings, errors } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import {
	MAIN_PADDING,
	SHORT_API_DATE_FORMAT,
	fullButton,
	DATE_FORMAT
} from "../../consts"
import { Icon } from "react-native-elements"
import { fetchOrError } from "../../actions/utils"
import DateTimePicker from "react-native-modal-datetime-picker"
import moment from "moment"
import AlertError from "../../components/AlertError"
import SuccessModal from "../../components/SuccessModal"

export class Kilometers extends AlertError {
	constructor(props) {
		super(props)
		this.state = {
			date: new Date(),
			start: "",
			end: "",
			personal: "",
			successVisible: false,
			datePickerVisible: false
		}
	}

	async submit() {
		const cars = await this.props.dispatch(
			fetchOrError(`/teacher/${this.props.user.teacher_id}/cars`, {
				method: "GET"
			})
		)
		if (cars.json.data.length <= 0) {
			Alert.alert(strings("errors.title"), errors("No cars available"))
			return
		}
		const car_id = cars.json.data[0].id
		const resp = await this.props.dispatch(
			fetchOrError("/teacher/cars/" + car_id + "/kilometer", {
				method: "POST",
				body: JSON.stringify({
					date: moment(this.state.date).format(SHORT_API_DATE_FORMAT),
					start: parseInt(this.state.start),
					end: parseInt(this.state.end),
					personal: parseInt(this.state.personal)
				})
			})
		)
		if (resp) {
			this.setState({ successVisible: true })
		}
	}

	_showDateTimePicker = () => this.setState({ datePickerVisible: true })

	_hideDateTimePicker = () => this.setState({ datePickerVisible: false })

	_handleDatePicked = date => {
		this._hideDateTimePicker()
		this.setState({ date: moment(date).format(SHORT_API_DATE_FORMAT) })
	}

	changeText = (name, val) => {
		this.setState({ [name]: val })
	}

	render() {
		return (
			<View style={styles.container}>
				<SuccessModal
					visible={this.state.successVisible}
					image="lesson"
					title={strings("settings.kilometers.success_title")}
					desc={strings("settings.kilometers.success_desc", {
						date: moment(this.state.date).format(DATE_FORMAT)
					})}
					buttonPress={() => {
						this.setState({ successVisible: false })
						this.props.navigation.goBack()
					}}
					button={strings("settings.kilometers.success_button")}
				/>
				<View style={styles.headerRow}>
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.goBack()
						}}
					>
						<Icon name="arrow-forward" type="material" />
					</TouchableOpacity>
					<PageTitle
						style={styles.title}
						title={strings("settings.report_types.kilometers")}
					/>
				</View>
				<ScrollView
					keyboardDismissMode={
						Platform.OS === "ios" ? "interactive" : "on-drag"
					}
					keyboardShouldPersistTaps="handled"
					style={styles.container}
				>
					<TouchableOpacity
						onPress={this._showDateTimePicker.bind(this)}
						style={styles.dateContainer}
					>
						<Text style={styles.date}>
							{moment(this.state.date).format(DATE_FORMAT)}
						</Text>
					</TouchableOpacity>
					<TextInput
						placeholder={strings(
							"settings.kilometers.start_of_day"
						)}
						value={this.state.start}
						onChangeText={val => this.changeText("start", val)}
						style={styles.input}
						keyboardType="number-pad"
					/>
					<TextInput
						placeholder={strings("settings.kilometers.end_of_day")}
						value={this.state.end}
						onChangeText={val => this.changeText("end", val)}
						style={styles.input}
						keyboardType="number-pad"
					/>
					<TextInput
						placeholder={strings("settings.kilometers.personal")}
						value={this.state.personal}
						onChangeText={val => this.changeText("personal", val)}
						style={styles.input}
						keyboardType="number-pad"
					/>
				</ScrollView>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : null}
					keyboardVerticalOffset={Platform.select({
						ios: fullButton.height,
						android: null
					})}
				>
					<TouchableOpacity
						onPress={this.submit.bind(this)}
						style={styles.floatButton}
					>
						<Text style={styles.buttonText}>
							{strings("teacher.new_lesson.done")}
						</Text>
					</TouchableOpacity>
				</KeyboardAvoidingView>
				<DateTimePicker
					isVisible={this.state.datePickerVisible}
					onConfirm={this._handleDatePicked}
					onCancel={this._hideDateTimePicker}
					maximumDate={new Date()}
					date={new Date(this.state.date)}
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
		marginLeft: 8,
		marginTop: -4
	},
	headerRow: {
		flexDirection: "row",
		padding: 0,
		justifyContent: "flex-start",
		marginLeft: MAIN_PADDING,
		marginRight: MAIN_PADDING,
		marginTop: 20
	},
	dateContainer: {
		alignSelf: "center",
		backgroundColor: "#f4f4f4",
		borderColor: "lightgray",
		borderWidth: 1,
		padding: 12
	},
	date: { alignSelf: "flex-start", fontSize: 20, fontWeight: "bold" },
	input: {
		backgroundColor: "#f4f4f4",
		padding: 20,
		marginTop: 12,
		textAlign: "right"
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 20
	},
	floatButton: {
		...fullButton,
		position: "relative"
	}
})
function mapStateToProps(state) {
	return {
		user: state.user,
		error: state.error,
		fetchService: state.fetchService
	}
}
export default connect(mapStateToProps)(Kilometers)
