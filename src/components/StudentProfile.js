import React, { Fragment } from "react"
import {
	ScrollView,
	View,
	StyleSheet,
	Text,
	TouchableOpacity
} from "react-native"
import { strings } from "../i18n"
import UserWithPic from "./UserWithPic"
import ShadowRect from "./ShadowRect"
import { MAIN_PADDING } from "../consts"
import { Icon } from "react-native-elements"
import TopicsList from "./TopicsList"
import StudentPayments from "./StudentPayments"
import { getPayments } from "../actions/lessons"
import StudentNextLessonView from "./StudentNextLessonView"
import SimpleLoader from "./SimpleLoader"
import { getUserImage } from "../actions/utils"
import FastImage from "react-native-fast-image"
import { NavigationActions } from "react-navigation"
import LessonPopup from "../components/LessonPopup"

export default class StudentProfile extends React.Component {
	constructor(props) {
		super(props)
		let student = this.props.user
		let showBackButton = false
		if (this.props.navigation.getParam("student")) {
			// if we are in other student's profile
			student = this.props.navigation.getParam("student")
			showBackButton = true
		}
		let isTeacher = false
		if (this.props.user.hasOwnProperty("teacher_id")) {
			isTeacher = true
		}
		this.state = {
			student,
			allTopics: [],
			combinedTopics: [],
			payments: [],
			nextLesson: "",
			isTeacher,
			loading: true,
			lessonPopupVisible: false,
			showBackButton
		}

		this._handleRequests()
	}

	_handleRequests = async () => {
		await this._getTopics()
		if (this.state.isTeacher) {
			await this._getNextLesson()
			await this._getPayments()
		}
		this.setState({ loading: false })
	}

	_getNextLesson = async () => {
		const now = new Date().toISOString()
		const resp = await this.props.fetchService.fetch(
			"/lessons/?limit=1&is_approved=true&date=ge:" +
				now +
				"&student_id=" +
				this.state.student.student_id,
			{ method: "GET" }
		)
		if (resp.json["data"].length == 0) return
		this.setState({
			nextLesson: resp.json["data"][0]
		})
	}

	_getPayments = async () => {
		const payments = await getPayments(
			this.props.fetchService,
			false,
			`student_id=${this.state.student.student_id}`
		)
		this.setState({
			payments: payments.payments
		})
	}
	_getTopics = async () => {
		const resp = await this.props.fetchService.fetch(
			`/student/${this.state.student.student_id}/topics`,
			{ method: "GET" }
		)
		const combinedTopics = [].concat.apply(
			[],
			Object.entries(resp.json["data"])
				.map(x => {
					if (x[0] != "new") return x[1]
				})
				.filter(x => x != undefined)
		)
		this.setState({
			allTopics: resp.json["data"],
			combinedTopics: combinedTopics
		})
	}

	_renderTopics = () => {
		if (this.state.loading) {
			return <SimpleLoader />
		}
		return (
			<Fragment>
				<TouchableOpacity
					onPress={() =>
						this.props.navigation.navigate("Topics", {
							topics: this.state.allTopics
						})
					}
					style={{ flexDirection: "row" }}
				>
					<Fragment>
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
							<Icon name="arrow-back" type="material" size={20} />
						</View>
					</Fragment>
				</TouchableOpacity>
				<TopicsList topics={this.state.combinedTopics} />
			</Fragment>
		)
	}

	lessonPress = () => {
		this.setState({ lessonPopupVisible: !this.state.lessonPopupVisible })
	}

	render() {
		const { student } = this.state
		let backButton
		if (this.state.showBackButton) {
			backButton = (
				<TouchableOpacity
					onPress={() => {
						this.props.navigation.dispatch(NavigationActions.back())
					}}
					style={styles.backButton}
				>
					<Icon name="arrow-forward" type="material" />
				</TouchableOpacity>
			)
		}
		let teacherView = <View style={{ marginTop: 20 }} />
		if (this.state.isTeacher) {
			// teacher is logged in, show next lesson and payments
			teacherView = (
				<Fragment>
					<ShadowRect style={{ ...styles.rect, marginTop: 20 }}>
						<Text style={styles.rectTitle} testID="schedule">
							{strings("teacher.home.next_lesson")}
						</Text>
						<StudentNextLessonView
							lessonPress={() => this.lessonPress()}
							testID="lessonRowTouchable"
							lesson={this.state.nextLesson}
							loading={this.state.loading}
						/>
						<LessonPopup
							visible={this.state.lessonPopupVisible}
							item={this.state.nextLesson}
							onPress={this.lessonPress}
							testID="lessonPopup"
							navigation={this.props.navigation}
						/>
					</ShadowRect>
					<ShadowRect style={styles.rect}>
						<Text style={styles.rectTitle} testID="schedule">
							{strings("teacher.students.balance")}
						</Text>
						<StudentPayments
							sum={this.state.student.balance}
							payments={this.state.payments.slice(0, 2)}
							loading={this.state.loading}
						/>
					</ShadowRect>
				</Fragment>
			)
		}
		return (
			<ScrollView style={{ flex: 1 }}>
				<View style={styles.container}>
					<View style={styles.header}>
						{backButton}
						<UserWithPic
							user={student.user || student}
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
							<FastImage
								style={styles.badge}
								source={{
									uri: getUserImage(student.my_teacher.user)
								}}
							/>
						</View>
					</View>
					{teacherView}
					<ShadowRect style={styles.rect}>
						{this._renderTopics()}
					</ShadowRect>
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: MAIN_PADDING,
		paddingRight: MAIN_PADDING,
		marginTop: 20,
		alignItems: "center"
	},
	backButton: { marginRight: 8 },
	header: {
		maxHeight: 60,
		flexDirection: "row",
		alignItems: "center"
	},
	rect: {},
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
