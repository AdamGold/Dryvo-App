import React from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import Notification from "../../components/Notification"
import PageTitle from "../../components/PageTitle"
import NotificationButtons from "./NotificationButtons"

export class Notifications extends React.Component {
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
	renderItem = item => {
		return (
			<Notification
				style={styles.notification}
				name="חגית שטיין"
				type="new_lesson"
				date="10.02"
				hours="10:00-10:40"
			>
				<NotificationButtons />
			</Notification>
		)
	}
	render() {
		return (
			<View style={styles.container}>
				<View testID="NotificationsView" style={styles.notifications}>
					<PageTitle title={strings("teacher.notifications.title")} />
					<FlatList
						data={[{ title: "Title Text", key: "item1" }]}
						renderItem={this.renderItem}
					/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	notifications: {
		flex: 1,
		paddingRight: 30,
		paddingLeft: 30,
		marginTop: 20
	},
	notification: {}
})

export default connect()(Notifications)
