import React, { Fragment } from "react"
import {
	ScrollView,
	View,
	Text,
	Image,
	StyleSheet,
	TouchableHighlight,
	FlatList
} from "react-native"
import { connect } from "react-redux"
import ShadowRect from "../../components/ShadowRect"
import UserWithPic from "../../components/UserWithPic"
import { strings } from "../../i18n"
import Row from "../../components/Row"
import Separator from "../../components/Separator"
import { Icon } from "react-native-elements"
import moment from "moment"
import Hours from "../../components/Hours"

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
			sum: 0
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
		const date = new Date()
		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
		const resp = await this.props.fetchService.fetch(
			"/lessons/payments?order_by=created_at desc&created_at=ge:" +
				firstDay.toISOString() +
				"&created_at=le:" +
				lastDay.toISOString(),
			{ method: "GET" }
		)
		var sum = 0
		for (var i = 0, _len = resp.json["data"].length; i < _len; i++) {
			sum += resp.json["data"][i]["amount"]
		}
		this.setState({
			payments: [...this.state.payments, ...resp.json["data"]],
			sum
		})
	}

	renderItem = ({ item, index }) => {
		const date = item.date
		return (
			<Row
				key={`item${item.id}`}
				style={styles.lessonRow}
				leftSide={<Hours duration={item.duration} date={date} />}
			>
				<UserWithPic
					name={item.student.user.name}
					nameStyle={styles.nameStyle}
				/>
			</Row>
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
	render() {
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
						{strings("teacher.home.current_lesson")}
					</Text>
					<FlatList
						data={this.state.items}
						renderItem={this.renderItem}
						ItemSeparatorComponent={this.lessonsSeperator}
						keyExtractor={item => `item${item.id}`}
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
						<Text testID="monthlyAmount" style={styles.rectTitle}>
							{strings("teacher.home.monthly_amount")}
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
						<Text style={styles.addPayment}>
							{strings("teacher.home.add_payment")}
						</Text>
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
	schedule: { minHeight: 230 },
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
		width: 74,
		height: 74,
		borderRadius: 37,
		marginBottom: 16
	},
	rectTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "rgb(121, 121, 121)",
		alignSelf: "flex-start"
	},
	lessonRow: {
		marginTop: 20,
		maxHeight: 34
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
		color: "rgb(24, 199, 20)"
	},
	nameStyle: {
		marginTop: 4
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
