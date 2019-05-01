import React from "react"
import { ActivityIndicator, StyleSheet, StatusBar, View } from "react-native"
import { connect } from "react-redux"
import { NavigationActions } from "react-navigation"

class UserLoading extends React.Component {
	componentWillMount() {
		let routeName
		if (
			this.props.user.hasOwnProperty("teacher_id") &&
			this.props.user.is_approved
		) {
			// it's a teacher
			routeName = "Teacher"
		} else if (
			this.props.user.hasOwnProperty("my_teacher") &&
			this.props.user.is_approved
		) {
			// it's a student
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
