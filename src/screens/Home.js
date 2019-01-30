import React from "react"
import { View, Text, Button, StyleSheet } from "react-native"
import { logout } from "../actions/auth"
import { connect } from "react-redux"

class Home extends React.Component {
	constructor(props) {
		super(props)
		this.logout = this.logout.bind(this)
	}

	logout() {
		this.props.dispatch(
			logout(() => {
				this.props.navigation.navigate("Auth")
			})
		)
	}
	render() {
		return (
			<View style={styles.container}>
				<Text>Hi!</Text>
				<Button onPress={this.logout} title="התנתק" />
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

export default connect()(Home)
