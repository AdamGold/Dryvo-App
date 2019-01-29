import React from "react"
import { ActivityIndicator, StyleSheet, StatusBar, View } from "react-native"
import Storage from "../../services/Storage"
import { TOKEN_KEY } from "../../consts"

export default class AuthLoading extends React.Component {
	constructor(props) {
		super(props)
		this._bootstrapAsync()
	}

	// Fetch the token from storage then navigate to our appropriate place
	_bootstrapAsync = async () => {
		const token = await Storage.getItem(TOKEN_KEY, true)

		// This will switch to the App screen or Auth screen and this loading
		// screen will be unmounted and thrown away.
		this.props.navigation.navigate(token ? "App" : "Auth")
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
