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
import UserWithPic from "../../components/UserWithPic"
import { strings } from "../../i18n"
import Row from "../../components/Row"
import Separator from "../../components/Separator"
import { Icon } from "react-native-elements"
import Hours from "../../components/Hours"
import LessonPopup from "../../components/LessonPopup"
import { MAIN_PADDING, colors } from "../../consts"
import { getPayments } from "../../actions/lessons"
import EmptyState from "../../components/EmptyState"
import { logout } from "../../actions/auth"

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
			items: [],
			payments: [],
			sum: 0,
			visible: []
		}

		this._getItems()
		this._getPayments()
	}

	_getItems = async () => {
		const now = new Date().toISOString()
		const resp = await this.props.fetchService.fetch(
			"/lessons/?limit=2&is_approved=true&date=ge:" + now,
			{ method: "GET" }
		)
		this.setState({
			items: [...this.state.items, ...resp.json["data"]]
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

	renderItem = ({ item, index }) => {
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
							name={item.student.user.name}
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
					name={item.student.user.name}
					nameStyle={styles.nameStyle}
				/>
			</Row>
		)
	}

	lessonsSeperator = () => {
		return (
			<Fragment>
				<Separator />
				<Text style={styles.rectTitle}>
					{strings("teacher.home.next_lesson")}
				</Text>
			</Fragment>
		)
	}

	_renderEmpty = type => (
		<EmptyState
			image={type}
			text={strings(`empty_${type}`)}
			style={styles.empty}
		/>
	)

	render() {
		let sumColor = colors.green
		if (this.state.sum < 0) sumColor = "red"
		return (
			<ScrollView>
				<View style={styles.container}>
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
							{strings("teacher.home.current_lesson")}
						</Text>
						<FlatList
							data={this.state.items}
							ListEmptyComponent={() =>
								this._renderEmpty("lessons")
							}
							renderItem={this.renderItem}
							ItemSeparatorComponent={this.lessonsSeperator}
							keyExtractor={item => `item${item.id}`}
							extraData={this.state.visible}
						/>
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
						<FlatList
							data={this.state.payments.slice(0, 2)}
							renderItem={this.renderPaymentItem}
							keyExtractor={item => `payment${item.id}`}
							ListEmptyComponent={() =>
								this._renderEmpty("payments")
							}
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
	schedule: { minHeight: 240 },
	welcomeHeader: {
		alignSelf: "center",
		alignItems: "center",
		marginBottom: 20
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
		marginTop: 24,
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
