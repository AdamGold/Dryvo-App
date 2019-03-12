import React from "react"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import StudentProfile from "../../components/StudentProfile"

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
		console.log(this.props)
		return <StudentProfile {...this.props} />
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		fetchService: state.fetchService
	}
}

export default connect(mapStateToProps)(Profile)
