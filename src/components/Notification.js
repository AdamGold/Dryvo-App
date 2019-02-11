import React, { Fragment } from "react"
import { StyleSheet, View, Text } from "react-native"
import UserWithPic from "./UserWithPic"
import LessonRow from "./LessonRow"
import { strings } from "../i18n"
import Separator from "./Separator"

const extras = {
	new_lesson: strings("teacher.notifications.new_lesson")
}

export default class Notification extends React.Component {
	render() {
		return (
			<Fragment>
				<LessonRow style={this.props.style}>
					<UserWithPic
						name={this.props.name}
						extra={extras[this.props.type]}
						width={54}
						height={54}
					/>
					<View style={styles.dateAndHour}>
						<Text style={styles.date}>{this.props.date}</Text>
						<Text style={styles.hour}>{this.props.hours}</Text>
					</View>
				</LessonRow>
				<View style={styles.buttons}>{this.props.children}</View>
				<Separator />
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	dateAndHour: {
		flex: 0.5,
		marginRight: "auto",
		marginTop: -8
	},
	date: {
		fontSize: 22,
		fontFamily: "Assistant-Light"
	},
	hour: {
		fontWeight: "bold",
		fontSize: 14,
		color: "rgb(12, 116, 244)"
	},
	buttons: {
		flex: 1,
		marginTop: 16,
		flexDirection: "row",
		justifyContent: "space-between"
	}
})
