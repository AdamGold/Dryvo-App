import React, { Fragment } from "react"
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Platform,
	ScrollView,
	Alert,
	TouchableHighlight,
	Linking
} from "react-native"
import { connect } from "react-redux"
import { strings, errors } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import {
	MAIN_PADDING,
	ROOT_URL,
	SHORT_API_DATE_FORMAT,
	floatButtonOnlyStyle,
	DISPLAY_SHORT_DATE_FORMAT
} from "../../consts"
import { Icon } from "react-native-elements"
import { API_ERROR } from "../../reducers/consts"
import {
	fetchOrError,
	popLatestError,
	navigateToEZCount
} from "../../actions/utils"
import ShadowRect from "../../components/ShadowRect"
import DateTimePicker from "react-native-modal-datetime-picker"
import moment from "moment"

export class Reports extends React.Component {
	constructor(props) {
		super(props)
		this.dates = ["since", "until"]
		this.state = {
			since: moment().startOf("month"),
			until: moment().endOf("month"),
			sinceVisible: false,
			untilVisible: false
		}
	}

	componentDidUpdate() {
		const error = this.props.dispatch(popLatestError(API_ERROR))
		if (error) {
			Alert.alert(strings("errors.title"), errors(error))
		}
	}

	_renderExternalReports() {
		const endpoints = {
			payments: "backoffice/reports/payments",
			incomes: "backoffice/reports",
			export: "backoffice/export",
			revenue: "backoffice/reports/revenue"
		}
		return Object.keys(endpoints).map((endpoint, index) => {
			return (
				<TouchableHighlight
					underlayColor="#f8f8f8"
					onPress={() => {
						this.props.dispatch(
							navigateToEZCount(endpoints[endpoint])
						)
					}}
					style={styles.fullWidth}
					key={endpoint}
				>
					<View style={styles.rectInsideView}>
						<Text>
							{strings("settings.report_types." + endpoint)}
						</Text>
					</View>
				</TouchableHighlight>
			)
		})
	}

	_showDateTimePicker = name => this.setState({ [name + "Visible"]: true })

	_hideDateTimePicker = name => this.setState({ [name + "Visible"]: false })

	_handleDatePicked = (name, date) => {
		this._hideDateTimePicker(name)
		this.setState({ [name]: moment(date).format(SHORT_API_DATE_FORMAT) })
	}

	async createReport(report_type) {
		let data = {
			report_type,
			since: this.state.since,
			until: this.state.until
		}
		const resp = await this.props.dispatch(
			fetchOrError(`/teacher/reports`, {
				method: "POST",
				body: JSON.stringify(data)
			})
		)
		if (resp) {
			Linking.openURL(
				ROOT_URL + "/teacher/reports/" + resp.json["data"]["uuid"]
			)
		}
	}

	render() {
		let displayDates = {}
		this.dates.forEach(name => {
			if (this.state[name]) {
				displayDates[name] = moment(this.state[name]).format(
					DISPLAY_SHORT_DATE_FORMAT
				)
			}
		})
		return (
			<ScrollView
				keyboardDismissMode="on-drag"
				keyboardShouldPersistTaps="always"
			>
				<View style={styles.container}>
					<PageTitle
						style={styles.title}
						title={strings("settings.reports")}
						leftSide={
							<TouchableOpacity
								onPress={() => {
									this.props.navigation.goBack()
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
					<ShadowRect style={styles.rect}>
						<TouchableHighlight
							underlayColor="#f8f8f8"
							onPress={() => {
								this.createReport("students")
							}}
							style={styles.fullWidth}
							key={`studentsReport`}
						>
							<View style={styles.rectInsideView}>
								<Text>
									{strings("settings.report_types.students")}
								</Text>
							</View>
						</TouchableHighlight>
						{this._renderExternalReports()}
					</ShadowRect>
					<Text style={styles.rectTitle}>
						{strings("settings.export_lessons_report")}
					</Text>
					<ShadowRect style={styles.rect}>
						<View style={styles.row}>
							<TouchableOpacity
								onPress={() => {
									this._showDateTimePicker(this.dates[0])
								}}
							>
								<View style={styles.dateContainer}>
									<Text style={styles.dateTitle}>
										{strings("settings.since_date")}
									</Text>
									<Text style={styles.dateText}>
										{displayDates.since}
									</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									this._showDateTimePicker(this.dates[1])
								}}
								style={styles.leftSide}
							>
								<View style={styles.dateContainer}>
									<Text style={styles.dateTitle}>
										{strings("settings.until_date")}
									</Text>
									<Text style={styles.dateText}>
										{displayDates.until}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
						<TouchableOpacity
							style={styles.button}
							onPress={() => {
								this.createReport("lessons")
							}}
						>
							<View>
								<Text style={styles.buttonText}>
									{strings("settings.product")}
								</Text>
							</View>
						</TouchableOpacity>
					</ShadowRect>
				</View>
				<DateTimePicker
					isVisible={this.state.sinceVisible}
					onConfirm={date => {
						this._handleDatePicked(this.dates[0], date)
					}}
					onCancel={() => {
						this._hideDateTimePicker(this.dates[0])
					}}
				/>
				<DateTimePicker
					isVisible={this.state.untilVisible}
					onConfirm={date => {
						this._handleDatePicked(this.dates[1], date)
					}}
					onCancel={() => {
						this._hideDateTimePicker(this.dates[1])
					}}
				/>
			</ScrollView>
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
	closeButton: {
		marginTop: Platform.select({ ios: -6, android: -12 })
	},
	rect: {
		marginTop: 12,
		marginBottom: 24,
		paddingHorizontal: 0,
		paddingVertical: 0
	},
	rectTitle: {
		fontWeight: "bold",
		alignSelf: "flex-start",
		color: "#5c5959"
	},
	rectInsideView: {
		width: "100%",
		borderBottomWidth: 1,
		borderBottomColor: "#f7f7f7",
		paddingVertical: 6,
		paddingHorizontal: 20,
		paddingVertical: 12,
		flexDirection: "row"
	},
	fullWidth: {
		flex: 1,
		width: "100%"
	},
	button: { ...floatButtonOnlyStyle, width: "100%", borderRadius: 0 },
	buttonText: {
		fontWeight: "bold",
		fontSize: 20,
		color: "#fff"
	},
	row: {
		flex: 1,
		flexDirection: "row",
		alignSelf: "center",
		width: "80%"
	},
	dateContainer: {
		padding: 18
	},
	dateTitle: {
		fontWeight: "bold",
		fontSize: 18,
		alignSelf: "flex-start"
	},
	dateText: {
		alignSelf: "flex-start"
	},
	leftSide: {
		flex: 1,
		marginLeft: "auto",
		alignSelf: "flex-start"
	}
})
function mapStateToProps(state) {
	return {
		errors: state.errors,
		fetchService: state.fetchService
	}
}
export default connect(mapStateToProps)(Reports)
