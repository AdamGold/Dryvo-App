import React, { Fragment } from "react"
import {
	View,
	StyleSheet,
	Text,
	Image,
	FlatList,
	TouchableOpacity
} from "react-native"
import { strings } from "../i18n"
import UserWithPic from "./UserWithPic"
import ShadowRect from "./ShadowRect"
import { MAIN_PADDING } from "../consts"
import { Icon } from "react-native-elements"
import TopicsList from "./TopicsList"

export default class StudentProfile extends React.Component {
	constructor(props) {
		// only here for the test suite to work
		super(props)
		let student = this.props.user
		if (this.props.navigation.getParam("student")) {
			// if we are in other student's profile
			student = this.props.navigation.getParam("student")
		}
		this.state = {
			student,
			allTopics: []
		}

		this._getTopics()
	}

	_getTopics = async () => {
		const resp = await this.props.fetchService.fetch(
			`/student/${this.state.student.student_id}/topics`,
			{ method: "GET" }
		)

		this.setState({
			allTopics: resp.json["data"]
		})
	}
	render() {
		const { student } = this.state
		const allTopics = [].concat.apply(
			[],
			Object.entries(this.state.allTopics)
				.map(x => {
					if (x[0] != "new") return x[1]
				})
				.filter(x => x != undefined)
		)
		let teacherView
		if (this.props.user.hasOwnProperty("teacher_id")) {
			// teacher is logged in, show next lesson and payments
			teacherView = (
				<Fragment>
					<ShadowRect style={styles.rect}>
						<Text style={styles.rectTitle} testID="schedule">
							{strings("teacher.home.next_lesson")}
						</Text>
					</ShadowRect>
					<ShadowRect style={styles.rect}>
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
					<View style={styles.badges}>
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
				<ShadowRect style={styles.rect}>
					<View style={{ flexDirection: "row" }}>
						<Text testID="monthlyAmount" style={styles.rectTitle}>
							{strings("teacher.new_lesson.topics", {
								topics: this.state.allTopics
							})}
						</Text>

						<View
							style={{
								flex: 1,
								marginLeft: "auto",
								alignItems: "flex-end"
							}}
						>
							<TouchableOpacity
								onPress={() =>
									this.props.navigation.navigate("Topics", {
										topics: this.state.allTopics
									})
								}
							>
								<Icon
									name="arrow-back"
									type="material"
									size={20}
								/>
							</TouchableOpacity>
						</View>
					</View>
					<TopicsList topics={allTopics} />
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
		maxHeight: 60,
		flexDirection: "row",
		alignItems: "center"
	},
	rect: {
		marginTop: 20
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
	badges: {
		marginLeft: "auto",
		marginTop: -6
	}
})
