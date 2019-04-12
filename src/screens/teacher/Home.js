import React, { Fragment } from "react"
import {
	ScrollView,
	View,
	Text,
	StyleSheet,
	TouchableHighlight,
	TouchableOpacity,
	FlatList
} from "react-native"
import { connect } from "react-redux"
import ShadowRect from "../../components/ShadowRect"
import UserWithPic from "../../components/UserWithPic"
import { strings } from "../../i18n"
import Row from "../../components/Row"
import Separator from "../../components/Separator"
import { Icon } from "react-native-elements"
import Hours from "../../components/Hours"
import LessonPopup from "../../components/LessonPopup"
import { MAIN_PADDING, colors, NAME_LENGTH } from "../../consts"
import { getPayments } from "../../actions/lessons"
import EmptyState from "../../components/EmptyState"
import LessonsLoader from "../../components/LessonsLoader"
import PaymentsLoader from "../../components/PaymentsLoader"
import { NavigationActions } from "react-navigation"
import { getUserImage, uploadUserImage } from "../../actions/utils"
import UploadProfileImage from "../../components/UploadProfileImage"
import moment from "moment"

export class Home extends React.Component {
	static navigationOptions = () => {
		return {
			title: "home",
			tabBarLabel: strings("tabs.home"),
			tabBarAccessibilityLabel: strings("tabs.home"),
			tabBarTestID: "HomeTab"
		}
	}

	constructor(props) {
		super(props)
		this.state = {
			currentLesson: null,
			nextLesson: null,
			payments: [],
			sum: 0,
			visible: [],
			loading: true
		}
	}

	componentDidMount() {
		this.willFocusSubscription = this.props.navigation.addListener(
			"willFocus",
			payload => {
				this._sendRequests()
			}
		)
	}

	componentWillUnmount() {
		this.willFocusSubscription.remove()
	}

	_sendRequests = async () => {
		await this._getLessons()
		await this._getPayments()
		this.setState({ loading: false })
	}

	_getLessons = async () => {
		const now = new Date().toISOString()
		const endOfDay = moment
			.utc()
			.endOf("day")
			.toISOString()
		const currentLessonResp = await this.props.fetchService.fetch(
			"/lessons/?limit=1&is_approved=true&date=ge:" +
				now +
				"&date=le:" +
				endOfDay,
			{ method: "GET" }
		)
		const nextLessonResp = await this.props.fetchService.fetch(
			"/lessons/?limit=2&is_approved=true&date=ge:" + now,
			{ method: "GET" }
		)
		let nextLesson = null,
			currentLesson = null

		if (nextLessonResp.json["data"].length > 0) {
			if (currentLessonResp.json["data"].length == 0) {
				// no current lesson (no lessons today)
				nextLesson = nextLessonResp.json["data"][0]
			} else {
				currentLesson = currentLessonResp.json["data"][0]
				nextLesson = nextLessonResp.json["data"][1]
			}
		}

		this.setState({
			currentLesson,
			nextLesson
		})
	}

	_getPayments = async () => {
		const payments = await getPayments(this.props.fetchService)
		this.setState({
			payments: payments.payments,
			sum: payments.sum
		})
	}

	lessonPress = item => {
		let newVisible
		if (this.state.visible.includes(item.id)) {
			// we pop it
			newVisible = this.state.visible.filter((v, i) => v != item.id)
		} else {
			newVisible = [...this.state.visible, item.id]
		}
		this.setState({ visible: newVisible })
	}

	renderLesson = item => {
		if (!item) {
			return (
				<Text
					style={{
						...styles.lessonRow,
						...styles.noLesson
					}}
				>
					{strings("teacher.home.no_lesson")}
				</Text>
			)
		}
		let student = strings("teacher.no_student_applied")
		let user = null
		if (item.student) {
			student = item.student.user.name
			user = item.student.user
		}
		const date = item.date
		let meetup = strings("not_set")
		if (item.meetup_place) meetup = item.meetup_place.name
		const visible = this.state.visible.includes(item.id) ? true : false
		return (
			<Fragment>
				<TouchableOpacity
					onPress={() => this.lessonPress(item)}
					testID="lessonRowTouchable"
				>
					<Row
						key={`item${item.id}`}
						style={styles.lessonRow}
						leftSide={
							<Hours
								style={styles.hours}
								duration={item.duration}
								date={date}
							/>
						}
					>
						<UserWithPic
							name={student}
							user={user}
							extra={
								<View style={{ alignItems: "flex-start" }}>
									<Text style={styles.places}>
										{strings("teacher.new_lesson.meetup")}:{" "}
										{meetup}
									</Text>
								</View>
							}
							nameStyle={styles.nameStyle}
							imageContainerStyle={styles.placesImage}
						/>
					</Row>
				</TouchableOpacity>
				<LessonPopup
					visible={visible}
					item={item}
					onPress={this.lessonPress}
					testID="lessonPopup"
					navigation={this.props.navigation}
				/>
			</Fragment>
		)
	}

	renderPaymentItem = ({ item, index }) => {
		let firstItemStyles = {}
		if (index == 0) {
			firstItemStyles = { marginTop: 0 }
		}
		return (
			<Row
				style={{ ...styles.paymentRow, ...firstItemStyles }}
				leftSide={
					<Text style={styles.amountOfStudent}>{item.amount}₪</Text>
				}
				key={`payment${item.id}`}
			>
				<UserWithPic
					user={item.student.user}
					nameStyle={styles.nameStyle}
				/>
			</Row>
		)
	}

	_renderEmpty = type => (
		<EmptyState
			image={type}
			text={strings(`empty_${type}`)}
			imageSize="small"
		/>
	)

	_navigateToSettings = () => {
		this.props.navigation.navigate("Settings")
	}

	_renderLessons = () => {
		if (this.state.loading) {
			return (
				<View style={styles.listLoader}>
					<LessonsLoader />
				</View>
			)
		}

		return (
			<Fragment>
				<Text style={styles.rectTitle} testID="schedule">
					{strings("teacher.home.current_lesson")}
				</Text>
				{this.renderLesson(this.state.currentLesson)}
				<Separator />
				<Text style={styles.rectTitle}>
					{strings("teacher.home.next_lesson")}
				</Text>
				{this.renderLesson(this.state.nextLesson)}
			</Fragment>
		)
	}

	_renderPayments = () => {
		if (this.state.loading) {
			return (
				<View style={styles.listLoader}>
					<PaymentsLoader />
				</View>
			)
		}
		let sumColor = colors.green
		if (this.state.sum < 0) sumColor = "red"
		let list
		if (this.state.payments.length == 0) {
			list = this._renderEmpty("payments")
		} else {
			list = (
				<FlatList
					data={this.state.payments.slice(0, 2)}
					renderItem={this.renderPaymentItem}
					keyExtractor={item => `payment${item.id}`}
				/>
			)
		}
		return (
			<Fragment>
				<View style={styles.amountView}>
					<Text style={{ ...styles.amount, color: sumColor }}>
						{this.state.sum}₪
					</Text>
					<TouchableOpacity
						onPress={() =>
							this.props.navigation.navigate("AddPayment")
						}
					>
						<Text style={styles.addPayment}>
							{strings("teacher.home.add_payment")}
						</Text>
					</TouchableOpacity>
				</View>
				<Separator />
				{list}
			</Fragment>
		)
	}

	render() {
		return (
			<ScrollView>
				<View style={styles.container}>
					<View style={styles.settingsIcon}>
						<TouchableOpacity
							onPress={this._navigateToSettings.bind(this)}
						>
							<Icon name="settings" type="material" size={24} />
						</TouchableOpacity>
					</View>
					<View testID="welcomeHeader" style={styles.welcomeHeader}>
						<UploadProfileImage
							style={styles.profilePic}
							image={getUserImage(this.props.user)}
							upload={async source => {
								await this.props.dispatch(
									uploadUserImage(source)
								)
							}}
						/>
						<Text style={styles.welcomeText}>
							{strings("teacher.home.welcome", {
								name: this.props.user.name.slice(0, NAME_LENGTH)
							})}
						</Text>
					</View>
					<ShadowRect style={styles.schedule}>
						{this._renderLessons()}
					</ShadowRect>

					<View style={styles.fullScheduleView}>
						<TouchableHighlight
							underlayColor="lightgray"
							onPress={() => {
								this.props.navigation.navigate("Schedule")
							}}
						>
							<Text style={styles.fullSchedule}>
								{strings("teacher.home.full_schedule")}
							</Text>
						</TouchableHighlight>
						<Icon
							size={20}
							color="rgb(12, 116, 244)"
							name="ios-arrow-dropleft-circle"
							type="ionicon"
						/>
					</View>
					<ShadowRect>
						<View style={{ flex: 1, flexDirection: "row" }}>
							<Text
								testID="monthlyAmount"
								style={styles.rectTitle}
							>
								{strings("teacher.home.monthly_amount")}
							</Text>
							<TouchableOpacity
								style={{
									flex: 1,
									alignItems: "flex-end",
									marginRight: "auto"
								}}
								onPress={() =>
									this.props.navigation.navigate({
										routeName: "Notifications",
										params: {},
										action: NavigationActions.navigate({
											routeName: "Main",
											params: {
												filter: "lessons/payments"
											}
										})
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
						{this._renderPayments()}
					</ShadowRect>
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
		paddingLeft: MAIN_PADDING,
		paddingRight: MAIN_PADDING,
		alignItems: "center"
	},
	schedule: { minHeight: 220 },
	welcomeHeader: {
		alignSelf: "center",
		alignItems: "center",
		marginBottom: 20
	},
	settingsIcon: {
		position: "absolute",
		right: MAIN_PADDING
	},
	welcomeText: {
		fontFamily: "Assistant-Light",
		fontSize: 24
	},
	profilePic: {
		width: 44,
		height: 44,
		borderRadius: 22,
		marginBottom: 16
	},
	rectTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "rgb(121, 121, 121)",
		alignSelf: "flex-start"
	},
	lessonRow: {
		marginTop: 12
	},
	hours: { marginTop: 8 },
	fullScheduleView: {
		flexDirection: "row",
		flex: 1,
		alignSelf: "center",
		alignItems: "center",
		marginTop: 4,
		marginBottom: 24
	},
	fullSchedule: {
		color: "rgb(12, 116, 244)",
		marginTop: -4,
		fontWeight: "bold",
		marginRight: 8
	},
	places: {
		fontSize: 14,
		color: "gray"
	},
	placesImage: { marginTop: 8 },
	amountView: {
		marginTop: 16,
		alignSelf: "center"
	},
	amount: {
		fontFamily: "Assistant-Light",
		fontSize: 44
	},
	addPayment: {
		color: "rgb(12, 116, 244)",
		fontWeight: "bold",
		marginTop: 16,
		alignSelf: "center"
	},
	amountOfStudent: {
		marginTop: 4
	},
	nameStyle: {
		marginTop: 4,
		marginLeft: -2
	},
	paymentRow: {
		marginTop: 12
	},
	listLoader: { marginTop: 20, alignSelf: "center" },
	noLesson: {
		fontSize: 20,
		alignSelf: "center"
	}
})

function mapStateToProps(state) {
	return {
		user: state.user,
		fetchService: state.fetchService
	}
}

export default connect(mapStateToProps)(Home)
