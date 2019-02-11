import React from "react"
import { View, Text, Button, StyleSheet, ScrollView } from "react-native"
import { logout } from "../../actions/auth"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import Notification from "../../components/Notification"
import PageTitle from "../../components/PageTitle"
import NotificationButtons from "./NotificationButtons"

class Notifications extends React.Component {
	static navigationOptions = () => {
		return {
			title: "notifications",
			tabBarLabel: strings("tabs.notifications_title"),
			tabBarAccessibilityLabel: strings("tabs.notifications_title"),
			tabBarTestID: "NotificationsTab"
		}
	}
	render() {
		return (
			<ScrollView style={styles.container}>
				<View testID="NotificationsView" style={styles.notifications}>
					<PageTitle title={strings("teacher.notifications.title")} />
					<Notification
						style={styles.notification}
						name="חגית שטיין"
						type="new_lesson"
						date="10.02"
						hours="10:00-10:40"
					>
						<NotificationButtons />
					</Notification>
					<Notification
						style={styles.notification}
						name="חגית שטיין"
						type="new_lesson"
						date="10.02"
						hours="10:00-10:40"
					>
						<NotificationButtons />
					</Notification>
					<Notification
						style={styles.notification}
						name="חגית שטיין"
						type="new_lesson"
						date="10.02"
						hours="10:00-10:40"
					>
						<NotificationButtons />
					</Notification>
				</View>
			</ScrollView>
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
