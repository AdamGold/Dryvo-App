import React, { Fragment } from "react"
import { View, StyleSheet, Text, Image, FlatList } from "react-native"
import { strings } from "../i18n"
import UserWithPic from "./UserWithPic"
import ShadowRect from "./ShadowRect"
import { MAIN_PADDING } from "../consts"

export default class StudentProfile extends React.Component {
	constructor(props) {
		// only here for the test suite to work
		super(props)
		console.log(this.props)
		let student = this.props.user
		if (this.props.navigation.getParam("student")) {
			// if we are in other student's profile
			student = this.props.navigation.getParam("student")
		}
		this.state = {
			student
		}

		this._getTopics()
	}

	_getTopics = async () => {
		const resp = await this.props.fetchService.fetch(
			`/student/${this.state.student.student_id}/topics`,
			{ method: "GET" }
		)

		this.setState({
			progress: resp.json["data"]["in_progress"].slice(0, 5),
			finished: resp.json["data"]["finished"].slice(0, 5)
		})
	}
	renderTopic = ({ item, index }) => {
		return (
			<View style={styles.topic}>
				<Text>{item.title}</Text>
			</View>
		)
	}
	render() {
		const { student } = this.state
		let teacherView
		if (this.props.user.hasOwnProperty("teacher_id")) {
			// teacher is logged in, show next lesson and payments
			teacherView = (
				<Fragment>
					<ShadowRect style={styles.topics}>
						<Text style={styles.rectTitle} testID="schedule">
							{strings("teacher.home.next_lesson")}
						</Text>
					</ShadowRect>
					<ShadowRect style={styles.topics}>
						<Text style={styles.rectTitle} testID="schedule">
							{strings("student.home.payments")}
						</Text>
					</ShadowRect>
				</Fragment>
			)
		}
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<UserWithPic
						name={student.user.name}
						extra={
							<Text>
								{student.new_lesson_number}{" "}
								{strings("student_profile.lessons")}
							</Text>
						}
						width={54}
						height={54}
					/>
					<View style={styles.myTeacher}>
						<Text style={styles.myTeacherLabel}>
							{strings("student_profile.my_teacher")}:{" "}
						</Text>
						<Image
							style={styles.badge}
							source={{
								uri:
									"https://images.unsplash.com/photo-1535643302794-19c3804b874b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80"
							}}
						/>
					</View>
				</View>
				{teacherView}
				<ShadowRect style={styles.topics}>
					<Text style={styles.rectTitle} testID="schedule">
						{strings("teacher.new_lesson.topics")}
					</Text>
					<Text style={styles.rectSubTitle}>
						{strings("student_profile.in_progress_topics")}
					</Text>
					<FlatList
						data={this.state.progress}
						renderItem={this.renderTopic}
						keyExtractor={item => `item${item.id}`}
						style={styles.topicsList}
					/>
					<Text style={styles.rectSubTitle}>
						{strings("student_profile.finished_topics")}
					</Text>
					<FlatList
						data={this.state.finished}
						renderItem={this.renderTopic}
						keyExtractor={item => `item${item.id}`}
						style={styles.topicsList}
					/>
				</ShadowRect>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginLeft: MAIN_PADDING,
		marginRight: MAIN_PADDING,
		marginTop: 20
	},
	header: {
		flex: 1,
		maxHeight: 60,
		flexDirection: "row",
		alignItems: "center"
	},
	topics: {
		marginTop: 20,
		maxHeight: 340
	},
	rectTitle: {
		fontWeight: "bold",
		color: "rgb(121, 121, 121)"
	},
	badge: {
		height: 24,
		width: 24,
		borderRadius: 12,
		marginLeft: 12,
		marginTop: -2
	},
	myTeacher: {
		flexDirection: "row",
		marginLeft: "auto",
		marginTop: -6
	},
	myTeacherLabel: {
		fontSize: 14
	},
	topicsList: {
		marginLeft: 12
	},
	rectSubTitle: {
		fontWeight: "bold",
		fontSize: 14,
		marginTop: 6
	},
	topic: {
		borderBottomColor: "lightgray",
		paddingTop: 6,
		paddingBottom: 6,
		width: "100%",
		borderBottomWidth: 1
	}
})
