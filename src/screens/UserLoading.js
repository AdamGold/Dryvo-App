import React from "react"
import { ActivityIndicator, StyleSheet, StatusBar, View } from "react-native"
import { connect } from "react-redux"
import { NavigationActions } from "react-navigation"

class UserLoading extends React.Component {
	componentWillMount() {
		const notificationData =
			this.props.navigation.getParam("notification") || {}
		let routeName
		let extra = {}
		if (notificationData.fromNotification) {
			navigateTo = "Notifications"
			let params
			if (notificationData.data.hasOwnProperty("lesson")) {
				navigateTo = "Lesson"
				params = {
					lesson_id: notificationData.data["lesson_id"]
				}
			}
			extra = {
				action: NavigationActions.navigate({
					routeName: navigateTo,
					params
				})
			}
		}
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
		this.props.navigation.navigate({
			routeName: routeName,
			...extra
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
