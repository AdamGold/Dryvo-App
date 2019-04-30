import React, { Fragment } from "react"
import {
	View,
	Text,
	TouchableHighlight,
	StyleSheet,
	FlatList,
	TouchableOpacity
} from "react-native"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import { MAIN_PADDING, NAME_LENGTH } from "../../consts"
import { Dropdown } from "react-native-material-dropdown"
import EmptyState from "../../components/EmptyState"
import StudentsLoader from "../../components/StudentsLoader"
import Notification from "../../components/Notification"
import moment from "moment"
import LessonPopup from "../../components/LessonPopup"
import Hours from "../../components/Hours"
import ShowReceipt from "../../components/ShowReceipt"

export class Notifications extends React.Component {
	static navigationOptions = () => {
		return {
			title: "notifications",
			tabBarLabel: strings("tabs.notifications_title"),
			tabBarAccessibilityLabel: strings("tabs.notifications_title"),
			tabBarTestID: "NotificationsTab"
		}
	}
	constructor(props) {
		super(props)
		this.filterOptions = [
			{
				value: "lessons/",
				label: strings("notifications.scheduled_lessons")
			},
			{
				value: "lessons/payments",
				label: strings("notifications.payments")
			}
		]
		this.state = {
			items: [],
			page: 1,
			nextUrl: "",
			filter: "",
			refreshing: false,
			visible: []
		}

		this._dropdownChange = this._dropdownChange.bind(this)
	}

	_onNavigationFocus = () => {
		this.setState(
			{
				filter:
					this.props.navigation.getParam("filter") ||
					this.filterOptions[0]["value"],
				loading: true,
				page: 1,
				nextUrl: ""
			},
			() => {
				this._getItems()
			}
		)
	}

	componentDidMount() {
		this.willFocusSubscription = this.props.navigation.addListener(
			"willFocus",
			payload => {
				this._onNavigationFocus()
			}
		)
	}

	componentWillUnmount() {
		this.willFocusSubscription.remove()
	}

	onRefresh = () => {
		this.setState({ page: 1, nextUrl: "", refreshing: true }, () => {
			this._getItems()
		})
	}

	_getItems = async (append = false) => {
		const resp = await this.props.fetchService.fetch(
			"/" +
				this.state.filter +
				"?limit=10&order_by=created_at desc&is_approved=true&creator_id=" +
				this.props.user.my_teacher.user.id +
				"&page=" +
				this.state.page,
			{
				method: "GET"
			}
		)
		let newValue = resp.json.data
		if (append) {
			newValue = [...this.state.items, ...newValue]
		}
		this.setState({
			items: newValue,
			nextUrl: resp.json["next_url"],
			loading: false,
			refreshing: false
		})
	}

	renderPayment = ({ item, index }) => {
		const date = moment
			.utc(item.created_at)
			.local()
			.format("DD.MM.YY, HH:mm")
		return (
			<Notification
				style={styles.notification}
				key={`payment${item.id}`}
				leftSide={<Text style={styles.amount}>{item.amount}₪</Text>}
				basic={
					<Fragment>
						<Text style={styles.basic}>{date}</Text>
						<ShowReceipt
							item={item}
							dispatch={this.props.dispatch}
							user={this.props.user}
							style={{ alignSelf: "flex-start" }}
						/>
					</Fragment>
				}
			/>
		)
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

	renderLesson = ({ item, index }) => {
		const visible = this.state.visible.includes(item.id) ? true : false
		return (
			<Fragment>
				<TouchableOpacity onPress={() => this.lessonPress(item)}>
					<Notification
						style={styles.notification}
						key={`lesson${item.id}`}
						basic={
							<Text style={styles.basic}>
								{this.props.user.my_teacher.user.name.slice(
									0,
									NAME_LENGTH
								)}{" "}
								{strings("notifications.teacher_scheduled")}
							</Text>
						}
						leftSide={
							<View>
								<Text style={styles.lessonDate}>
									{moment
										.utc(item.date)
										.local()
										.format("DD.MM")}
								</Text>
								<Text style={styles.lessonHour}>
									<Hours
										duration={item.duration}
										date={item.date}
									/>
								</Text>
							</View>
						}
					/>
					<LessonPopup
						visible={visible}
						item={item}
						onPress={this.lessonPress}
						testID="lessonPopup"
						navigation={this.props.navigation}
					/>
				</TouchableOpacity>
			</Fragment>
		)
	}

	_renderItems = () => {
		if (this.state.loading) {
			return <StudentsLoader />
		}
		let render = this.renderLesson
		let type = "lesson"
		if (this.state.filter.includes("payments")) {
			render = this.renderPayment
			type = "payment"
		}
		return (
			<FlatList
				data={this.state.items}
				renderItem={render}
				onEndReached={this.endReached.bind(this)}
				keyExtractor={item => `${type}${item.id}`}
				ListEmptyComponent={this._renderEmpty}
				extraData={this.state.visible}
				onRefresh={() => this.onRefresh()}
				refreshing={this.state.refreshing}
			/>
		)
	}

	endReached = () => {
		if (!this.state.nextUrl) return
		this.setState(
			{
				page: this.state.page + 1,
				nextUrl: ""
			},
			() => {
				this._getItems(true)
			}
		)
	}

	_dropdownChange = (value, index, data) => {
		this.setState(
			{
				page: 1,
				nextUrl: "",
				filter: value
			},
			() => {
				this._getItems()
			}
		)
	}

	_renderEmpty = () => (
		<EmptyState
			image="notifications"
			text={strings("empty_notifications")}
			style={styles.empty}
		/>
	)

	render() {
		return (
			<View style={styles.container}>
				<View testID="NotificationsView" style={styles.notifications}>
					<PageTitle
						style={styles.title}
						title={strings("tabs.notifications_title")}
						leftSide={
							<View>
								<Dropdown
									containerStyle={styles.dropdown}
									value={this.state.filter}
									data={this.filterOptions}
									onChangeText={this._dropdownChange}
									dropdownMargins={{ min: 0, max: 20 }}
									dropdownOffset={{ top: 0, left: 0 }}
									pickerStyle={{ marginTop: 60 }}
								/>
							</View>
						}
					/>
					<View style={styles.items}>{this._renderItems()}</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	notifications: {
		flex: 1,
		paddingRight: MAIN_PADDING,
		paddingLeft: MAIN_PADDING,
		marginTop: 20
	},
	items: {
		marginTop: 20
	},
	notification: {},
	title: { marginBottom: 0 },
	dropdown: {
		alignSelf: "flex-end",
		width: 160,
		marginTop: 4
	},
	empty: {
		marginTop: 100
	},
	amount: {
		marginTop: 12,
		fontSize: 20,
		fontWeight: "bold"
	},
	basic: {
		marginTop: 10,
		fontSize: 18
	},
	lessonDate: {
		fontSize: 22,
		fontFamily: "Assistant-Light"
	},
	lessonHour: {
		fontWeight: "bold",
		fontSize: 14,
		color: "rgb(12, 116, 244)"
	}
})

function mapStateToProps(state) {
	return {
		user: state.user,
		fetchService: state.fetchService
	}
}

export default connect(mapStateToProps)(Notifications)
