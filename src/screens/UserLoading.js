import React from "react"
import { ActivityIndicator, StyleSheet, StatusBar, View } from "react-native"
import { connect } from "react-redux"
import { NavigationActions } from "react-navigation"
import { getRole } from "../actions/auth"

class UserLoading extends React.Component {
	componentWillMount() {
		let routeName
		const role = getRole(this.props.user)
		if (role == "teacher") {
			routeName = "Teacher"
		} else if (role == "student") {
			routeName = "Student"
		} else {
			this.props.navigation.navigate("NormalUser")
			return
		}
		let action = {}
		if (this.props.navigation.getParam("filter")) {
			action = {
				action: NavigationActions.navigate({
					routeName: "Notifications",
					action: NavigationActions.navigate({
						routeName: "Main",
						params: {
							filter: this.props.navigation.getParam("filter")
						}
					})
				})
			}
		}
		this.props.navigation.navigate({
			routeName,
			...action
		})
	}

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

function mapStateToProps(state) {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(UserLoading)
