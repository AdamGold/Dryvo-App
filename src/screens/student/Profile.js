import React from "react"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import StudentProfile from "../../components/StudentProfile"
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
		fetchService: state.fetchService
	}
}
const profileScreen = connect(mapStateToProps)(Profile)
const profile = createStackNavigator(
	{ Profile: profileScreen, Topics },
	{
		initialRouteName: "Profile",
		headerMode: "none",
		navigationOptions: {
			headerVisible: false
		}
	}
)
export default profile
