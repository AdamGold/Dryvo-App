import React from "react"
import { ActivityIndicator, StyleSheet, StatusBar, View } from "react-native"
import Storage from "../../services/Storage"
import { connect } from "react-redux"
import { NOTIFICATIONS_KEY } from "../../consts"
import { loadFetchService, registerDeviceToken } from "../../actions/utils"
import { fetchUser, logout } from "../../actions/auth"
import firebase from "react-native-firebase"
import { NavigationActions } from "react-navigation"

export class AuthLoading extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			fromNotification: false,
			data: {}
		}
		this._bootstrapAsync()
		this._setNotifications()
	}

	async componentDidMount() {
		this.createNotificationListeners()
	}
	async createNotificationListeners() {
		/*
		 * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
		 * */
		this.notificationOpenedListener = firebase
			.notifications()
			.onNotificationOpened(notificationOpen => {
				console.log("background notification")
				this.setState({
					fromNotification: true,
					data: notificationOpen.notification._data
				})
			})

		/*
		 * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
		 * */
		const notificationOpen = await firebase
			.notifications()
			.getInitialNotification()
		if (notificationOpen) {
			console.log("background2 notification")

			this.setState({
				fromNotification: true,
				data: notificationOpen.notification._data
			})
		}
	}

	async checkPermission() {
		const enabled = await firebase.messaging().hasPermission()
		if (enabled) {
			this.getToken()
		} else {
			this.requestPermission()
		}
	}

	async getToken() {
		fcmToken = await firebase.messaging().getToken()
		if (fcmToken) {
			// user has a device token
			await this.props.dispatch(registerDeviceToken(fcmToken))
		}
	}

	async requestPermission() {
		try {
			await firebase.messaging().requestPermission()
			// User has authorised
			this.getToken()
		} catch (error) {
			// User has rejected permissions
			console.log("permission rejected")
		}
	}
	_setNotifications = async () => {
		// if no notification key set in storage (first time in app?), set to true
		const notifications = await Storage.getItem(NOTIFICATIONS_KEY)
		if (notifications === null || notifications === undefined) {
			await Storage.setItem(NOTIFICATIONS_KEY, "true")
		}
	}

	// Fetch the token from storage then navigate to our appropriate place
	_bootstrapAsync = async () => {
		this.props.dispatch(loadFetchService())
		await this.props.dispatch(
			fetchUser(async (user = null) => {
				this.checkPermission()
				if (user === null) await this.props.dispatch(logout())
				// logging out just to make sure
				let action = {}
				if (this.state.fromNotification && user) {
					action = {
						action: NavigationActions.navigate({
							routeName: "First",
							params: {
								notification: this.state
							}
						})
					}
				}
				this.props.navigation.navigate({
					routeName: user ? "App" : "Auth",
					params: {},
					...action
				})
			})
		)
	}

	// Render any loading content that you like here
	render() {
		return (
			<View style={styles.container}>
				<ActivityIndicator />
				<StatusBar barStyle="default" />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center"
	}
})

export default connect()(AuthLoading)
