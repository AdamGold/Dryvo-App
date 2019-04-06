import React from "react"
import {
	ScrollView,
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	TouchableHighlight,
	Alert
} from "react-native"
import { connect } from "react-redux"
import { strings, errors } from "../i18n"
import ShadowRect from "../components/ShadowRect"
import {
	MAIN_PADDING,
	floatButtonOnlyStyle,
	NOTIFICATIONS_KEY
} from "../consts"
import PageTitle from "../components/PageTitle"
import { NavigationActions } from "react-navigation"
import { Button, Icon } from "react-native-elements"
import RectInput from "../components/RectInput"
import { logout, setUser } from "../actions/auth"
import { API_ERROR } from "../reducers/consts"
import Storage from "../services/Storage"
import { fetchOrError, popLatestError } from "../actions/utils"

export class Settings extends React.Component {
	constructor(props) {
		// only here for the test suite to work
		super(props)
		this.defaultState = {
			name: "",
			area: "",
			password: "",
			notifications: "true"
		}
		this.state = this.defaultState
		this._initNotifications()
	}

	logout = () => {
		this.props.dispatch(
			logout(() => {
				this.props.navigation.navigate("Auth")
			})
		)
	}

	componentDidUpdate() {
		const error = this.props.dispatch(popLatestError(API_ERROR))
		if (error) {
			Alert.alert(strings("errors.title"), errors(error))
		}
	}

	submitInfo = async () => {
		const resp = await this.props.dispatch(
			fetchOrError("/login/edit_data", {
				method: "POST",
				body: JSON.stringify({
					name: this.state.name,
					area: this.state.area,
					password: this.state.password
				})
			})
		)
		if (resp) {
			await this.props.dispatch(setUser(resp.json.data))
			Alert.alert(strings("settings.success"))
			this.setState(this.defaultState)
		}
	}

	onChangeText = (param, value) => {
		this.setState({
			[param]: value
		})
	}

	_initNotifications = async () => {
		const notifications = await Storage.getItem(NOTIFICATIONS_KEY)
		this.setState({
			notifications
		})
	}

	toggleNotifications = () => {
		let notifications = "true"
		if (this.state.notifications === "true") {
			notifications = "false"
		}
		this.setState(
			{
				notifications
			},
			async () => {
				await Storage.setItem(NOTIFICATIONS_KEY, notifications)
			}
		)
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
						title={strings("settings.title")}
						leftSide={
							<Button
								icon={
									<Icon
										name="ios-close"
										type="ionicon"
										size={36}
									/>
								}
								onPress={() => {
									this.props.navigation.dispatch(
										NavigationActions.back()
									)
								}}
								type="clear"
								style={styles.closeButton}
							/>
						}
					/>
					<Text style={styles.rectTitle}>
						{strings("settings.personal_info")}
					</Text>
					<ShadowRect style={styles.rect}>
						<RectInput
							label={strings("signup.name")}
							iconName="person"
							value={this.state.name}
							onChangeText={value =>
								this.onChangeText("name", value)
							}
						/>
						<RectInput
							label={strings("signup.area")}
							iconName="person-pin"
							value={this.state.area}
							onChangeText={value =>
								this.onChangeText("area", value)
							}
						/>
						<RectInput
							label={strings("signin.password")}
							iconName="security"
							value={this.state.password}
							onChangeText={value =>
								this.onChangeText("password", value)
							}
							secureTextEntry
						/>
						<TouchableOpacity
							style={styles.button}
							onPress={this.submitInfo.bind(this)}
						>
							<View>
								<Text style={styles.buttonText}>
									{strings("settings.submit")}
								</Text>
							</View>
						</TouchableOpacity>
					</ShadowRect>
					<Text style={styles.rectTitle}>
						{strings("settings.general")}
					</Text>
					<ShadowRect style={styles.rect}>
						<TouchableHighlight
							underlayColor="#f8f8f8"
							onPress={() =>
								this.props.navigation.navigate("WorkDays")
							}
							style={styles.fullWidth}
						>
							<View style={styles.rectInsideView}>
								<Text>{strings("settings.work_hours")}</Text>
							</View>
						</TouchableHighlight>

						<TouchableHighlight
							underlayColor="#f8f8f8"
							onPress={this.toggleNotifications.bind(this)}
							style={styles.fullWidth}
						>
							<View style={styles.rectInsideView}>
								<Text style={styles.rightSide}>
									{strings("settings.notifications")}
								</Text>
								<Text style={styles.leftSide}>
									{strings(
										"settings.notifications_" +
											this.state.notifications
									)}
								</Text>
							</View>
						</TouchableHighlight>
						<View style={styles.rectInsideView}>
							<Text>{strings("settings.support")}</Text>
						</View>
					</ShadowRect>
					<TouchableHighlight onPress={this.logout.bind(this)}>
						<Text style={styles.logout}>
							{strings("settings.logout")}
						</Text>
					</TouchableHighlight>
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: MAIN_PADDING,
		paddingRight: MAIN_PADDING,
		marginTop: 20,
		alignItems: "center"
	},
	closeButton: {
		marginTop: -6
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
	button: { ...floatButtonOnlyStyle, width: "100%", borderRadius: 0 },
	buttonText: {
		fontWeight: "bold",
		fontSize: 20,
		color: "#fff"
	},
	logout: {
		fontWeight: "bold",
		alignSelf: "center",
		color: "red",
		marginBottom: MAIN_PADDING
	},
	leftSide: { flex: 1, marginLeft: "auto" },
	fullWidth: {
		flex: 1,
		width: "100%"
	}
})

function mapStateToProps(state) {
	return {
		errors: state.errors
	}
}

export default connect(mapStateToProps)(Settings)
