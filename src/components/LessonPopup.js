import React from "react"
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native"
import Modal from "react-native-modal"
import { strings } from "../i18n"
import Hours from "./Hours"
import moment from "moment"
import { floatButtonOnlyStyle } from "../consts"

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
			>
				<View style={styles.popup} testID={this.props.testID}>
					<TouchableOpacity onPress={this.navigateToProfile}>
						<Image
							style={styles.image}
							source={{
								uri:
									"https://images.unsplash.com/photo-1535643302794-19c3804b874b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80"
							}}
						/>
					</TouchableOpacity>
					<Text style={styles.title}>
						{`${strings("teacher.home.lesson_number")} ${
							item.lesson_number
						}`}{" "}
						- {item.student.user.name}
					</Text>
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
					>
						<View testID="editLessonButton" style={styles.button}>
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
		maxHeight: 300,
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
	button: {
		...floatButtonOnlyStyle,
		alignSelf: "center",
		position: "absolute",
		bottom: -80
	},
	buttonText: {
		fontWeight: "bold",
		color: "#fff",
		fontSize: 20
	}
})
