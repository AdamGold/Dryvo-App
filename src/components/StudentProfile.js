import React, { Fragment } from "react"
import {
	ScrollView,
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Linking,
	Alert
} from "react-native"
import { strings, errors } from "../i18n"
import UserWithPic from "./UserWithPic"
import ShadowRect from "./ShadowRect"
import { MAIN_PADDING, colors } from "../consts"
import { Icon } from "react-native-elements"
import TopicsList from "./TopicsList"
import StudentPayments from "./StudentPayments"
import { getPayments } from "../actions/lessons"
import StudentNextLessonView from "./StudentNextLessonView"
import SimpleLoader from "./SimpleLoader"
import { getUserImage, Analytics } from "../actions/utils"
import FastImage from "react-native-fast-image"
import { NavigationActions } from "react-navigation"
import LessonPopup from "../components/LessonPopup"
import ContactPopup from "../components/ContactPopup"
import AlertError from "./AlertError"
import { getRole } from "../actions/auth"

export default class StudentProfile extends AlertError {
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
		if (getRole(this.props.user) == "teacher") {
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
			showBackButton,
			contactVisible: false
		}
	}

	componentDidMount() {
		this.willFocusSubscription = this.props.navigation.addListener(
			"willFocus",
			payload => {
				this._handleRequests()
			}
		)
	}

	componentWillUnmount() {
		this.willFocusSubscription.remove()
	}

	_handleRequests = async () => {
		await this._getTopics()
		if (this.state.isTeacher) {
			await this._getNextLesson()
			await this._getPayments()
		}
		this.setState({ loading: false })
	}

	_navigateToPayments = () => {
		this.props.navigation.navigate("Payments", {
			filter: "appointments/payments",
			extraFilter: "&student_id=" + this.state.student.student_id,
			filterText: this.state.student.name
		})
	}

	_getNextLesson = async () => {
		const now = new Date().toISOString()
		const resp = await this.props.fetchService.fetch(
			"/appointments/?limit=1&is_approved=true&date=ge:" +
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

	_updateStudent = student => {
		// called on go back from student edit
		this.setState({ student })
	}

	_renderBadges = () => {
		const { student } = this.state
		const badges = {
			eyes_check: "target",
			doctor_check: "activity",
			theory: "file-text",
			green_form: "book"
		}
		return Object.keys(badges).map((key, index) => {
			if (!student[key] || student[key] == "") return
			const content = (
				<Fragment>
					<Icon type="feather" name={`${badges[key]}`} size={24} />
					<Text style={styles.badgeText}>
						{strings("student_profile." + key)}
					</Text>
				</Fragment>
			)
			if (key == "green_form") {
				return (
					<TouchableOpacity
						onPress={() => Linking.openURL(student.green_form)}
						key={key}
					>
						{content}
					</TouchableOpacity>
				)
			}
			return (
				<View style={styles.badge} key={key}>
					{content}
				</View>
			)
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

	contactPress = () => {
		this.setState({
			contactVisible: !this.state.contactVisible
		})
	}

	render() {
		const { student } = this.state
		let backButton, contact
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
			contact = (
				<TouchableOpacity
					onPress={this.contactPress.bind(this)}
					style={styles.badge}
				>
					<Icon type="feather" name="phone" size={24} />
					<Text style={styles.badgeText}>
						{strings("student_profile.contact")}
					</Text>
				</TouchableOpacity>
			)
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
							isStudent={!this.state.isTeacher}
						/>
					</ShadowRect>
					<ShadowRect style={styles.rect}>
						<TouchableOpacity
							onPress={this._navigateToPayments.bind(this)}
							style={{ flex: 1, flexDirection: "row" }}
						>
							<Fragment>
								<Text style={styles.rectTitle}>
									{strings("teacher.students.balance")}
								</Text>
								<View style={styles.paymentsButton}>
									<Icon
										name="arrow-back"
										type="material"
										size={20}
									/>
								</View>
							</Fragment>
						</TouchableOpacity>
						<StudentPayments
							sum={this.state.student.balance}
							payments={this.state.payments.slice(0, 2)}
							loading={this.state.loading}
							dispatch={this.props.dispatch}
							user={this.props.user}
						/>
					</ShadowRect>
				</Fragment>
			)
		}
		return (
			<ScrollView style={{ flex: 1 }}>
				<View style={styles.container}>
					<ContactPopup
						phone={this.state.student.phone}
						visible={this.state.contactVisible}
						onPress={this.contactPress.bind(this)}
					/>
					<View style={styles.header}>
						{backButton}
						<UserWithPic
							user={student.user || student}
							extra={
								<View style={{ alignItems: "flex-start" }}>
									<Text>
										{student.lessons_done}{" "}
										{strings("student_profile.lessons")}
									</Text>
									<TouchableOpacity
										onPress={() =>
											this.props.navigation.navigate(
												"EditStudent",
												{
													student: this.state.student,
													onGoBack: this
														._updateStudent
												}
											)
										}
									>
										<Text style={{ color: colors.blue }}>
											{strings("student_profile.edit")}
										</Text>
									</TouchableOpacity>
								</View>
							}
							width={54}
							height={54}
						/>
						<View style={styles.myTeacher}>
							<Text>{strings("student_profile.my_teacher")}</Text>
							<FastImage
								style={styles.teacherImage}
								source={{
									uri: getUserImage(student.my_teacher.user)
								}}
							/>
						</View>
					</View>
					<View style={styles.badges}>
						{this._renderBadges()}
						{contact}
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
	teacherImage: {
		height: 24,
		width: 24,
		borderRadius: 12,
		marginLeft: 12,
		marginTop: -2
	},
	myTeacher: {
		marginLeft: "auto",
		marginTop: -6,
		flexDirection: "row"
	},
	badges: {
		marginTop: 24,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly"
	},
	badge: { padding: 12 },
	badgeText: { marginTop: 8 },
	greenForm: {
		flex: 1,
		width: "100%",
		height: "100%"
	},
	paymentsButton: { flex: 1, alignItems: "flex-end", marginRight: "auto" }
})
