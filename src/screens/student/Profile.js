import React from "react"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import StudentProfile from "../../components/StudentProfile"
import EditStudent from "../../components/EditStudent"
import Notifications from "../teacher/Notifications"
import { createStackNavigator } from "react-navigation"
import Topics from "../Topics"

export class Profile extends React.Component {
	static navigationOptions = () => {
		return {
			title: "notifications",
			tabBarLabel: strings("tabs.notifications_title"),
			tabBarAccessibilityLabel: strings("tabs.notifications_title"),
			tabBarTestID: "NotificationsTab"
		}
	}
	constructor(props) {
		// only here for the test suite to work
		super(props)
	}

	render() {
		return <StudentProfile {...this.props} />
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		fetchService: state.fetchService,
		error: state.error
	}
}
const profileScreen = connect(mapStateToProps)(Profile)
const editScreen = connect(mapStateToProps)(EditStudent)
const profile = createStackNavigator(
	{
		Main: profileScreen,
		Topics,
		EditStudent: editScreen,
		Payments: Notifications
	},
	{
		initialRouteName: "Main",
		headerMode: "none",
		navigationOptions: {
			headerVisible: false
		}
	}
)
export default profile
