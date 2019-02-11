import React, { Fragment } from "react"
import { StyleSheet, View, Text } from "react-native"
import StudentWithPic from "./StudentWithPic"
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
					<StudentWithPic
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
				<View style={styles.buttons}>
					<View
						style={{
							...styles.button,
							...{ backgroundColor: "rgb(12,116,244)" }
						}}
					>
						<Text style={styles.buttonText}>
							{strings("approve")}
						</Text>
					</View>
					<View
						style={{
							...styles.button,
							...{ backgroundColor: "rgb(197,197,197)" }
						}}
					>
						<Text style={styles.buttonText}>{strings("edit")}</Text>
					</View>
					<View
						style={{
							...styles.button,
							...{ backgroundColor: "rgb(240,8,48)" }
						}}
					>
						<Text style={styles.buttonText}>
							{strings("postpone")}
						</Text>
					</View>
				</View>
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
	},
	button: {
		flex: 0.33,
		alignItems: "center",
		padding: 8,
		borderRadius: 3,
		backgroundColor: "#000"
	},
	buttonText: {
		fontSize: 14,
		color: "#fff",
		fontWeight: "bold"
	}
})
