import React from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import Modal from "react-native-modal"
import { strings } from "../i18n"
import Hours from "./Hours"
import moment from "moment"
import { fullButton, NAME_LENGTH } from "../consts"
import { getUserImage } from "../actions/utils"
import FastImage from "react-native-fast-image"

export default class LessonPopup extends React.Component {
	constructor(props) {
		super(props)
		this.navigateToProfile = this.navigateToProfile.bind(this)
		this.navigateToLesson = this.navigateToLesson.bind(this)
	}

	navigateToLesson = () => {
		this.props.onPress(this.props.item)
		this.props.navigation.navigate("Lesson", {
			lesson: this.props.item
		})
	}

	navigateToProfile = () => {
		this.props.onPress(this.props.item)
		this.props.navigation.navigate("StudentProfile", {
			student: this.props.item.student
		})
	}

	render() {
		const { item } = this.props
		if (!item) return null
		let student = strings("teacher.no_student_applied")
		let image
		if (item.student) {
			const name = item.student.user.name.slice(0, NAME_LENGTH)
			student = `${strings("teacher.home.lesson_number")} ${
				item.lesson_number
			} - ${name}`
			if (item.student.user.image) {
				image = (
					<FastImage
						style={styles.image}
						source={{
							uri: getUserImage(item.student.user)
						}}
					/>
				)
			}
		}
		let meetup = strings("not_set")
		if (item.meetup_place) meetup = item.meetup_place.name
		let dropoff = strings("not_set")
		if (item.dropoff_place) dropoff = item.dropoff_place.name
		let approved
		if (!item.is_approved) {
			approved = (
				<Text style={{ color: "red" }}>
					({strings("not_approved")})
				</Text>
			)
		}
		return (
			<Modal
				isVisible={this.props.visible}
				onBackdropPress={() => this.props.onPress(item)}
				animationIn="pulse"
				animationOut="fadeOut"
			>
				<View style={styles.popup} testID={this.props.testID}>
					<TouchableOpacity onPress={this.navigateToProfile}>
						{image}
					</TouchableOpacity>
					<Text style={styles.title}>{student}</Text>
					<Text style={styles.approved}>{approved}</Text>
					<View style={styles.row}>
						<View style={styles.column}>
							<Text style={styles.titles}>
								{strings("teacher.new_lesson.date")}
							</Text>
							<Text style={styles.texts}>
								{moment.utc(item.date).format("DD-MM-YYYY")}
							</Text>
						</View>
						<View style={{ ...styles.column, marginLeft: 2 }}>
							<Text style={styles.titles}>
								{strings("teacher.new_lesson.hour")}
							</Text>
							<Hours
								style={styles.texts}
								duration={item.duration}
								date={item.date}
							/>
						</View>
					</View>
					<View style={styles.row}>
						<View style={styles.column}>
							<Text style={styles.titles}>
								{strings("teacher.new_lesson.meetup")}
							</Text>
							<Text style={styles.texts}>{meetup}</Text>
						</View>
						<View style={{ ...styles.column, marginLeft: 2 }}>
							<Text style={styles.titles}>
								{strings("teacher.new_lesson.dropoff")}
							</Text>
							<Text style={styles.texts}>{dropoff}</Text>
						</View>
					</View>
					<TouchableOpacity
						underlayColor="#ffffff00"
						onPress={this.navigateToLesson}
						style={styles.button}
					>
						<View testID="editLessonButton">
							<Text style={styles.buttonText}>
								{strings("edit_lesson")}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	popup: {
		flex: 1,
		maxHeight: 320,
		backgroundColor: "#fff",
		padding: 26,
		alignSelf: "center",
		width: 280,
		alignContent: "center",
		borderRadius: 4
	},
	image: {
		marginTop: -80,
		width: 76,
		height: 76,
		borderRadius: 38,
		alignSelf: "center"
	},
	title: {
		fontWeight: "bold",
		fontSize: 18,
		alignSelf: "center",
		marginTop: 16
	},
	approved: { alignSelf: "center", marginTop: 6 },
	row: {
		flex: 1,
		flexDirection: "row",
		alignItems: "flex-start",
		marginTop: 20,
		maxHeight: 60
	},
	column: {
		flexDirection: "column",
		justifyContent: "flex-start",
		width: 140
	},
	titles: {
		fontWeight: "bold",
		fontSize: 14,
		color: "gray",
		alignSelf: "flex-start"
	},
	texts: { fontSize: 18, marginTop: 6, alignSelf: "flex-start" },
	button: { ...fullButton, width: 280 },
	buttonText: {
		fontWeight: "bold",
		color: "#fff",
		fontSize: 20
	}
})
