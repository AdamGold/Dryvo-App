import React from "react"
import { ActivityIndicator, StyleSheet, StatusBar, View } from "react-native"
import { connect } from "react-redux"

class UserLoading extends React.Component {
	componentWillMount() {
		if (this.props.user.hasOwnProperty("teacher_id")) {
			// it's a teacher
			this.props.navigation.navigate("Teacher")
		} else if (this.props.user.hasOwnProperty("my_teacher")) {
			// it's a student
			this.props.navigation.navigate("Student")
		} else {
			// non of the above - normal user
			this.props.navigation.navigate("NormalUser")
		}
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
