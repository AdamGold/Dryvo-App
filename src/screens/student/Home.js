import React, { Fragment } from "react"
import {
	ScrollView,
	View,
	Text,
	Image,
	StyleSheet,
	TouchableHighlight,
	TouchableOpacity
} from "react-native"
import { connect } from "react-redux"
import ShadowRect from "../../components/ShadowRect"
import { strings } from "../../i18n"
import { Icon } from "react-native-elements"
import LessonPopup from "../../components/LessonPopup"
import { getPayments } from "../../actions/lessons"
import { MAIN_PADDING } from "../../consts"
import StudentPayments from "../../components/StudentPayments"
import StudentNextLessonView from "../../components/StudentNextLessonView"

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
			lessonPopupVisible: false,
			loading: true
		}

		this._handleRequests()
	}

	_handleRequests = async () => {
		await this._getLesson()
		await this._getPayments()
		this.setState({ loading: false })
	}
	_navigateToSettings = () => {
		this.props.navigation.navigate("Settings")
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
			payments: payments.payments
		})
	}

	lessonPress = () => {
		this.setState({ lessonPopupVisible: !this.state.lessonPopupVisible })
	}

	renderLesson = () => {
		const { lesson } = this.state
		return (
			<Fragment>
				<StudentNextLessonView
					onPress={() => this.lessonPress()}
					testID="lessonRowTouchable"
					lesson={lesson}
					loading={this.state.loading}
				/>
				<LessonPopup
					visible={this.state.lessonPopupVisible}
					item={lesson}
					onPress={this.lessonPress}
					testID="lessonPopup"
					navigation={this.props.navigation}
				/>
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
						{this.renderLesson()}
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
								{strings("student.home.payments")}
							</Text>
							<View
								style={{
									flex: 1,
									alignItems: "flex-end",
									marginRight: "auto"
								}}
							>
								<Icon
									name="arrow-back"
									type="material"
									size={20}
								/>
							</View>
						</View>
						<StudentPayments
							sum={this.props.user.balance}
							payments={this.state.payments.slice(0, 2)}
							loading={this.state.loading}
						/>
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
	settingsIcon: {
		position: "absolute",
		right: MAIN_PADDING
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
		marginTop: 4,
		marginBottom: 24
	},
	fullSchedule: {
		color: "rgb(12, 116, 244)",
		marginTop: -4,
		fontWeight: "bold",
		marginRight: 8
	}
})

function mapStateToProps(state) {
	return {
		user: state.user,
		fetchService: state.fetchService
	}
}

export default connect(mapStateToProps)(Home)
