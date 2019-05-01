import React from "react"
import {
	ActivityIndicator,
	StyleSheet,
	StatusBar,
	View,
	Platform
} from "react-native"
import Storage from "../../services/Storage"
import { connect } from "react-redux"
import { NOTIFICATIONS_KEY } from "../../consts"
import { loadFetchService, checkFirebasePermission } from "../../actions/utils"
import { fetchUser, logout } from "../../actions/auth"
import { NavigationActions } from "react-navigation"

export class AuthLoading extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: {}
		}
		this._bootstrapAsync()
		this._setNotifications()
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
				await this.props.dispatch(checkFirebasePermission())
				if (user === null) await this.props.dispatch(logout())
				// logging out just to make sure
				this.props.navigation.navigate({
					routeName: user ? "App" : "Auth",
					params: {},
					action: NavigationActions.navigate({
						routeName: "First",
						params: this.props.navigation.state.params
					})
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
