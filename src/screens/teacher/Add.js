import React from "react"
import { View, Text, Button, StyleSheet, ScrollView } from "react-native"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import Notification from "../../components/Notification"
import PageTitle from "../../components/PageTitle"
import NotificationButtons from "./NotificationButtons"

class Add extends React.Component {
	static navigationOptions = () => {
		return {
			title: "add",
			tabBarLabel: strings("tabs.add"),
			tabBarAccessibilityLabel: strings("tabs.add"),
			tabBarTestID: "AddTab"
		}
	}
	render() {
		return <ScrollView style={styles.container} />
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

export default connect()(Add)
