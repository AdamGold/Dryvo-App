import React, { Fragment } from "react"
import {
	ScrollView,
	View,
	Text,
	Image,
	StyleSheet,
	TouchableHighlight,
	TouchableOpacity,
	FlatList
} from "react-native"
import { connect } from "react-redux"
import ShadowRect from "../../components/ShadowRect"
import { strings } from "../../i18n"
import Row from "../../components/Row"
import Separator from "../../components/Separator"
import { Icon } from "react-native-elements"
import Hours from "../../components/Hours"
import LessonPopup from "../../components/LessonPopup"
import { getPayments } from "../../actions/lessons"
import moment from "moment"
import { DATE_FORMAT } from "../../consts"

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
			lesson: "",
			payments: [],
			sum: 0,
			lessonPopupVisible: false
		}

		this._getLesson()
		this._getPayments()
	}

	_getLesson = async () => {
		const now = new Date().toISOString()
		const resp = await this.props.fetchService.fetch(
			"/lessons/?limit=1&is_approved=true&date=ge:" + now,
			{ method: "GET" }
		)
		if (resp.json["data"].length == 0) return
		this.setState({
			lesson: resp.json["data"][0]
		})
	}

	_getPayments = async () => {
		const payments = await getPayments(this.props.fetchService)
		this.setState({
			payments: payments.payments,
			sum: payments.sum
		})
	}

	lessonPress = () => {
		this.setState({ lessonPopupVisible: !this.state.lessonPopupVisible })
	}

	renderLesson = () => {
		const { lesson } = this.state
		let meetup = strings("not_set")
		if (lesson.meetup_place) meetup = lesson.meetup_place.name
		return (
			<Fragment>
				<TouchableOpacity
					onPress={() => this.lessonPress()}
					testID="lessonRowTouchable"
				>
					<Row
						style={styles.lessonRow}
						leftSide={
							<Hours
								duration={lesson.duration}
								date={lesson.date}
								style={styles.hoursStyle}
							/>
						}
					>
						<Text style={styles.placeStyle}>
							{strings("teacher.new_lesson.meetup")}: {meetup}
						</Text>
					</Row>
				</TouchableOpacity>
				<LessonPopup
					visible={this.state.lessonPopupVisible}
					item={lesson}
					onPress={this.lessonPress}
					onButtonPress={() => {
						this.lessonPress()
						this.props.navigation.navigate("Lesson", {
							lesson
						})
					}}
					testID="lessonPopup"
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
			>
				<Text>{moment.utc(item.created_at).format(DATE_FORMAT)}</Text>
			</Row>
		)
	}
	render() {
		let lessonRender
		if (this.state.lesson) lessonRender = this.renderLesson()
		return (
			<ScrollView style={styles.container}>
				<View testID="welcomeHeader" style={styles.welcomeHeader}>
					<Image
						style={styles.profilePic}
						source={{
							uri:
								"https://images.unsplash.com/photo-1535643302794-19c3804b874b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80"
						}}
					/>
					<Text style={styles.welcomeText}>
						{strings("teacher.home.welcome", {
							name: this.props.user["name"]
						})}
					</Text>
				</View>
				<ShadowRect style={styles.schedule}>
					<Text style={styles.rectTitle} testID="schedule">
						{strings("teacher.home.next_lesson")}
					</Text>
					{lessonRender}
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
						<Text testID="monthlyAmount" style={styles.rectTitle}>
							{strings("student.home.payments")}
						</Text>
						<View
							style={{
								flex: 1,
								alignItems: "flex-end",
								marginRight: "auto"
							}}
						>
							<Icon name="arrow-back" type="material" size={20} />
						</View>
					</View>
					<View style={styles.amountView}>
						<Text style={styles.amount}>{this.state.sum}₪</Text>
					</View>
					<Separator />
					<FlatList
						data={this.state.payments.slice(0, 2)}
						renderItem={this.renderPaymentItem}
						keyExtractor={item => `item${item.id}`}
					/>
				</ShadowRect>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20
	},
	profilePic: {
		width: 44,
		height: 44,
		borderRadius: 22,
		marginBottom: 16
	},
	welcomeHeader: {
		alignSelf: "center",
		alignItems: "center",
		marginBottom: 20
	},
	welcomeText: {
		fontFamily: "Assistant-Light",
		fontSize: 24
	},
	hoursStyle: { marginBottom: -8 },
	rectTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "rgb(121, 121, 121)",
		alignSelf: "flex-start"
	},
	lessonRow: {
		marginTop: 12
	},
	fullScheduleView: {
		flexDirection: "row",
		flex: 1,
		alignSelf: "center",
		alignItems: "center",
		marginTop: 24,
		marginBottom: 24
	},
	fullSchedule: {
		color: "rgb(12, 116, 244)",
		marginTop: -4,
		fontWeight: "bold",
		marginRight: 8
	},
	amountView: {
		marginTop: 16,
		alignSelf: "center"
	},
	amount: {
		fontFamily: "Assistant-Light",
		fontSize: 44,
		color: "rgb(24, 199, 20)"
	},
	addPayment: {
		color: "rgb(12, 116, 244)",
		fontWeight: "bold",
		marginTop: 16,
		alignSelf: "center"
	},
	amountOfStudent: {
		color: "rgb(24, 199, 20)",
		marginTop: 8
	},
	paymentRow: {
		maxHeight: 34,
		marginTop: 20
	}
})

function mapStateToProps(state) {
	return {
		user: state.user,
		fetchService: state.fetchService
	}
}

export default connect(mapStateToProps)(Home)
