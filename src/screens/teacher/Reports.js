import React, { Fragment } from "react"
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Platform,
	ScrollView,
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
import { fetchOrError, navigateToEZCount } from "../../actions/utils"
import ShadowRect from "../../components/ShadowRect"
import DateTimePicker from "react-native-modal-datetime-picker"
import moment from "moment"
import AlertError from "../../components/AlertError"

export class Reports extends AlertError {
	constructor(props) {
		super(props)
		this.dates = ["since", "until"]
		this.state = {
			since: moment()
				.startOf("month")
				.format(SHORT_API_DATE_FORMAT),
			until: moment()
				.endOf("month")
				.format(SHORT_API_DATE_FORMAT),
			sinceVisible: false,
			untilVisible: false
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

	_renderDatePickers() {
		return this.dates.map((name, index) => {
			return (
				<DateTimePicker
					isVisible={this.state[name + "Visible"]}
					onConfirm={date => {
						this._handleDatePicked(name, date)
					}}
					onCancel={() => {
						this._hideDateTimePicker(name)
					}}
					key={`picker-${name}${index}`}
				/>
			)
		})
	}

	_renderVisibleDates() {
		let displayDates = {}
		return this.dates.map((name, index) => {
			let style = {}
			if (index % 2 == 0) {
				style = styles.leftSide
			}
			if (this.state[name]) {
				displayDates[name] = moment(this.state[name]).format(
					DISPLAY_SHORT_DATE_FORMAT
				)
			}
			return (
				<TouchableOpacity
					onPress={() => {
						this._showDateTimePicker(name)
					}}
					style={style}
					key={`date-${name}${index}`}
				>
					<View style={styles.dateContainer}>
						<Text style={styles.dateTitle}>
							{strings("settings." + name + "_date")}
						</Text>
						<Text style={styles.dateText}>
							{displayDates[name]}
						</Text>
					</View>
				</TouchableOpacity>
			)
		})
	}

	render() {
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
							{this._renderVisibleDates()}
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
				{this._renderDatePickers()}
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
		error: state.error,
		fetchService: state.fetchService
	}
}
export default connect(mapStateToProps)(Reports)
