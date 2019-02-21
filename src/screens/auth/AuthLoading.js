import React from "react"
import { ActivityIndicator, StyleSheet, StatusBar, View } from "react-native"
import Storage from "../../services/Storage"
import { connect } from "react-redux"
import { TOKEN_KEY } from "../../consts"
import { loadFetchService } from "../../actions/utils"
import { fetchUser, logout } from "../../actions/auth"

export class AuthLoading extends React.Component {
	constructor(props) {
		super(props)
		this._bootstrapAsync()
	}

	// Fetch the token from storage then navigate to our appropriate place
	_bootstrapAsync = async () => {
		this.props.dispatch(loadFetchService())
		await this.props.dispatch(
			fetchUser(async (user = null) => {
				if (user === null) await this.props.dispatch(logout())
				// logging out just to make sure
				this.props.navigation.navigate(user ? "App" : "Auth")
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
