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
import { MAIN_PADDING, REPORT_TYPES, ROOT_URL } from "../../consts"
import { Icon } from "react-native-elements"
import { API_ERROR } from "../../reducers/consts"
import {
	fetchOrError,
	popLatestError,
	navigateToEZCount
} from "../../actions/utils"
import ShadowRect from "../../components/ShadowRect"

export class Reports extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
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

	async createReport(report_type) {
		let data = {
			report_type
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

	_renderInternalReports() {
		return REPORT_TYPES.map((name, index) => {
			return (
				<TouchableHighlight
					underlayColor="#f8f8f8"
					onPress={() => {
						this.createReport(name)
					}}
					style={styles.fullWidth}
					key={`${name}-${index}`}
				>
					<View style={styles.rectInsideView}>
						<Text>{strings("settings.report_types." + name)}</Text>
					</View>
				</TouchableHighlight>
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
						{this._renderInternalReports()}
						{this._renderExternalReports()}
					</ShadowRect>
				</View>
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
	}
})
function mapStateToProps(state) {
	return {
		errors: state.errors,
		fetchService: state.fetchService
	}
}
export default connect(mapStateToProps)(Reports)
