import React, { Fragment } from "react"
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Platform,
	ScrollView,
	TouchableHighlight,
	Alert
} from "react-native"
import { connect } from "react-redux"
import { strings, errors } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import {
	MAIN_PADDING,
	colors,
	fullButton,
	API_DATE_FORMAT,
	SHORT_API_DATE_FORMAT
} from "../../consts"
import { Icon } from "react-native-elements"
import DateTimePicker from "react-native-modal-datetime-picker"
import moment from "moment"
import { API_ERROR } from "../../reducers/consts"
import { fetchOrError, popLatestError } from "../../actions/utils"

const DEFAULT_HOURS = {
	from_hour: 8,
	from_minutes: 0,
	to_hour: 17,
	to_minutes: 0
}
export class WorkDays extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isTimePickerVisible: false,
			daysWithHours: {},
			fromSchedule: this.props.navigation.getParam("fromSchedule")
		}

		this.days = [0, 1, 2, 3, 4, 5, 6]
		if (this.state.fromSchedule) {
			// this means we need to add work hours
			// to specific dates
			this.days = this._getWeekDays()
		}
		this.days.forEach(day => {
			this.state.daysWithHours[day] = []
		})

		this._getDays()
	}

	_getDays = async () => {
		try {
			let extra
			if (this.state.fromSchedule) {
				const startOfWeek = moment()
					.startOf("week")
					.format(SHORT_API_DATE_FORMAT)
				const endOfWeek = moment()
					.endOf("week")
					.format(SHORT_API_DATE_FORMAT)
				extra =
					"?on_date=ge:" + startOfWeek + "&on_date=le:" + endOfWeek
			}
			const resp = await this.props.fetchService.fetch(
				"/teacher/work_days" + extra,
				{
					method: "GET"
				}
			)
			let day,
				newState = { ...this.state.daysWithHours }
			resp.json["data"].forEach(hour => {
				if (!hour["on_date"] && this.state.fromSchedule) {
					// when we're in a specific week, we are only interested in specific work days
					return
				}
				day = hour["day"]
				if (hour["on_date"]) {
					day = moment
						.utc(hour["on_date"])
						.format(SHORT_API_DATE_FORMAT)
				}
				newState[day].push(hour)
			})
			this.setState({
				daysWithHours: newState
			})
		} catch (error) {}
	}

	_getWeekDays = () => {
		var date = moment().startOf("week"),
			weeklength = 7,
			result = []
		while (weeklength--) {
			result.push(date.format(SHORT_API_DATE_FORMAT))
			date.add(1, "day")
		}
		return result
	}

	_showDateTimePicker = (day, index, type) => {
		this.setState({
			isTimePickerVisible: true,
			pickedDay: day,
			pickedIndex: index,
			pickedType: type
		})
	}

	_hideDateTimePicker = () => this.setState({ isTimePickerVisible: false })

	_handleDatePicked = date => {
		const hour = moment(date).format("HH")
		const minutes = moment(date).format("mm")
		const { pickedDay, pickedIndex, pickedType } = this.state
		let newDay = [...this.state.daysWithHours[pickedDay]]
		newDay[pickedIndex] = {
			...newDay[pickedIndex],
			[`${pickedType}_hour`]: hour,
			[`${pickedType}_minutes`]: minutes
		}

		this.setState({
			daysWithHours: { ...this.state.daysWithHours, [pickedDay]: newDay }
		})

		this._hideDateTimePicker()
	}

	_addHours = day => {
		let newDay = [...this.state.daysWithHours[day], DEFAULT_HOURS]
		this.setState({
			daysWithHours: { ...this.state.daysWithHours, [day]: newDay }
		})
	}
	_renderHours = day => {
		return this.state.daysWithHours[day].map((hour, index) => {
			return (
				<View key={`hour${index}`} style={styles.hoursRow}>
					<TouchableOpacity
						onPress={() => {
							this._showDateTimePicker(day, index, "from")
						}}
						style={styles.hour}
					>
						<Text>
							{hour.from_hour.toString().padStart(2, "0")}:
							{hour.from_minutes.toString().padStart(2, "0")}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							this._showDateTimePicker(day, index, "to")
						}}
						style={styles.hour}
					>
						<Text>
							{hour.to_hour.toString().padStart(2, "0")}:
							{hour.to_minutes.toString().padStart(2, "0")}
						</Text>
					</TouchableOpacity>
				</View>
			)
		})
	}
	_renderDays = () => {
		return Object.keys(this.state.daysWithHours).map((day, index) => {
			let style = {}
			if (index == 0) {
				style = { marginTop: 0 }
			}
			return (
				<View key={`day${index}`} style={{ ...styles.day, ...style }}>
					<Text style={styles.dayTitle}>{day}</Text>
					{this._renderHours(day)}
					<TouchableOpacity
						style={styles.addButton}
						onPress={() => this._addHours(day)}
					>
						<Text style={styles.addButtonText}>
							{strings("teacher.work_days.add")}
						</Text>
					</TouchableOpacity>
				</View>
			)
		})
	}

	componentDidUpdate() {
		const error = this.props.dispatch(popLatestError(API_ERROR))
		if (error) {
			Alert.alert(strings("errors.title"), errors(error))
		}
	}

	save = async () => {
		console.log(this.state.daysWithHours)
		const resp = await this.props.dispatch(
			fetchOrError("/teacher/work_days", {
				method: "POST",
				body: JSON.stringify(this.state.daysWithHours)
			})
		)
		if (resp) {
			Alert.alert(strings("teacher.work_days.success"))
			this.props.navigation.goBack()
		}
	}

	render() {
		let title = strings("teacher.work_days.title")
		if (this.state.fromSchedule) {
			title = strings("teacher.work_days.title_from_schedule")
		}
		return (
			<Fragment>
				<ScrollView>
					<View style={styles.container}>
						<PageTitle
							style={styles.title}
							title={title}
							leftSide={
								<TouchableOpacity
									onPress={() => {
										this.props.navigation.dispatch(
											NavigationActions.back()
										)
									}}
									style={styles.closeButton}
								>
									<Icon
										name="ios-close"
										type="ionicon"
										size={36}
									/>
								</TouchableOpacity>
							}
						/>
						<View style={styles.days}>{this._renderDays()}</View>
						<DateTimePicker
							isVisible={this.state.isTimePickerVisible}
							mode={"time"}
							onConfirm={this._handleDatePicked.bind(this)}
							onCancel={this._hideDateTimePicker}
							is24Hour={true}
						/>
					</View>
				</ScrollView>
				<TouchableHighlight
					underlayColor="#ffffff00"
					onPress={this.save.bind(this)}
					style={fullButton}
				>
					<Text style={styles.buttonText}>
						{strings("teacher.work_days.save")}
					</Text>
				</TouchableHighlight>
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginLeft: MAIN_PADDING,
		marginRight: MAIN_PADDING,
		marginTop: 20
	},
	title: {
		marginTop: 4
	},
	days: {
		flex: 1
	},
	day: {
		marginTop: 20
	},
	dayTitle: {
		fontWeight: "bold",
		marginLeft: 8,
		alignSelf: "center"
	},
	row: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "flex-start"
	},
	hoursRow: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 12
	},
	hour: {
		width: 100,
		alignItems: "center",
		paddingVertical: 8,
		backgroundColor: "#f8f8f8",
		marginRight: 12
	},
	inputStyle: {},
	inputContainer: {
		maxWidth: 150
	},
	addButton: {
		marginTop: 8,
		alignSelf: "center",
		alignItems: "center"
	},
	addButtonText: {
		color: colors.blue,
		fontWeight: "bold"
	},
	closeButton: {
		marginTop: Platform.select({ ios: -6, android: -12 })
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold"
	}
})
function mapStateToProps(state) {
	return {
		errors: state.errors,
		fetchService: state.fetchService
	}
}
export default connect(mapStateToProps)(WorkDays)
