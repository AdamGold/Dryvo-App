import React, { Fragment } from "react"
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
	NOTIFICATIONS_KEY,
	SUPPORT_PHONE
} from "../consts"
import PageTitle from "../components/PageTitle"
import { NavigationActions } from "react-navigation"
import { Button, Icon } from "react-native-elements"
import RectInput from "../components/RectInput"
import { logout, setUser } from "../actions/auth"
import Storage from "../services/Storage"
import {
	fetchOrError,
	deleteDeviceToken,
	navigateToEZCount
} from "../actions/utils"
import validate, { registerValidation } from "../actions/validate"
import ContactPopup from "../components/ContactPopup"
import AlertError from "../components/AlertError"

export class Settings extends AlertError {
	constructor(props) {
		// only here for the test suite to work
		super(props)
		this.state = {
			name: this.props.user.name,
			area: this.props.user.area,
			phone: this.props.user.phone,
			password: "",
			price: this.props.user.price,
			duration: this.props.user.lesson_duration,
			notifications: "true",
			contactVisible: false
		}
		this._initNotifications()
	}

	logout = async () => {
		await this.props.dispatch(deleteDeviceToken())
		this.props.dispatch(
			logout(async () => {
				this.props.navigation.navigate("Auth")
			})
		)
	}

	submitTeacherInfo = async () => {
		await this.submit("/teacher/edit_data", {
			price: this.state.price,
			lesson_duration: this.state.duration
		})
	}

	submitInfo = async () => {
		let error,
			flag = true
		for (let input of ["phone", "password"]) {
			if (this.state[input] != "") {
				error = validate(input, this.state[input], registerValidation)
				if (error) {
					flag = false
					break
				}
			}
		}
		if (!flag) {
			Alert.alert(error)
			return
		}
		const resp1 = await this.submit("/login/edit_data", {
			name: this.state.name,
			area: this.state.area,
			password: this.state.password,
			phone: this.state.phone
		})
		let resp2 = false
		if (this.props.user.hasOwnProperty("teacher_id")) {
			resp2 = await this.submitTeacherInfo()
		}

		if (resp1) {
			if (resp2) {
				await this.props.dispatch(setUser(resp2.json.data))
			} else {
				await this.props.dispatch(setUser(resp1.json.data))
			}
			Alert.alert(strings("settings.success"))
		}
	}

	submit = async (endpoint, body) => {
		const resp = await this.props.dispatch(
			fetchOrError(endpoint, {
				method: "POST",
				body: JSON.stringify(body)
			})
		)
		return resp
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

	contactPress = () => {
		this.setState({ contactVisible: !this.state.contactVisible })
	}

	render() {
		let extraSettings, extraForm
		if (this.props.user.hasOwnProperty("teacher_id")) {
			extraSettings = (
				<Fragment>
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
						onPress={() => {
							this.props.dispatch(
								navigateToEZCount("backoffice/expenses")
							)
						}}
						style={styles.fullWidth}
					>
						<View style={styles.rectInsideView}>
							<Text>{strings("settings.expenses")}</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight
						underlayColor="#f8f8f8"
						onPress={() => {
							this.props.navigation.navigate("Reports")
						}}
						style={styles.fullWidth}
					>
						<View style={styles.rectInsideView}>
							<Text>{strings("settings.reports")}</Text>
						</View>
					</TouchableHighlight>
				</Fragment>
			)
			extraForm = (
				<Fragment>
					<RectInput
						label={strings("signup.price")}
						iconName="payment"
						value={this.state.price.toString()}
						onChangeText={value =>
							this.onChangeText("price", value)
						}
					/>
					<RectInput
						label={strings("signup.duration")}
						iconName="access-time"
						value={this.state.duration.toString()}
						onChangeText={value =>
							this.onChangeText("duration", value)
						}
					/>
				</Fragment>
			)
		}
		return (
			<ScrollView
				keyboardDismissMode="on-drag"
				keyboardShouldPersistTaps="always"
			>
				<ContactPopup
					phone={SUPPORT_PHONE}
					visible={this.state.contactVisible}
					onPress={this.contactPress.bind(this)}
				/>
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
						{strings("settings.general")}
					</Text>
					<ShadowRect style={styles.rect}>
						{extraSettings}
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
						<TouchableHighlight
							underlayColor="#f8f8f8"
							onPress={this.contactPress.bind(this)}
							style={styles.fullWidth}
						>
							<View style={styles.rectInsideView}>
								<Text>{strings("settings.support")}</Text>
							</View>
						</TouchableHighlight>
					</ShadowRect>
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
							label={strings("signup.phone")}
							iconName="phone"
							value={this.state.phone}
							onChangeText={value =>
								this.onChangeText("phone", value)
							}
						/>
						{extraForm}
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

					<TouchableOpacity onPress={this.logout.bind(this)}>
						<Text style={styles.logout}>
							{strings("settings.logout")}
						</Text>
					</TouchableOpacity>
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
	rightside: { flex: 1, alignSelf: "flex-start" },
	leftSide: { flex: 1, marginLeft: "auto", alignSelf: "flex-end" },
	fullWidth: {
		flex: 1,
		width: "100%"
	}
})

function mapStateToProps(state) {
	return {
		user: state.user,
		error: state.error
	}
}

export default connect(mapStateToProps)(Settings)
