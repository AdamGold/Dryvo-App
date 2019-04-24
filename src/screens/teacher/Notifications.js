import React, { Fragment } from "react"
import {
	View,
	Text,
	TouchableHighlight,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Alert
} from "react-native"
import { connect } from "react-redux"
import { strings, errors } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import { MAIN_PADDING } from "../../consts"
import { Dropdown } from "react-native-material-dropdown"
import EmptyState from "../../components/EmptyState"
import StudentsLoader from "../../components/StudentsLoader"
import Notification from "../../components/Notification"
import NotificationButtons from "./NotificationButtons"
import Hours from "../../components/Hours"
import moment from "moment"
import LessonPopup from "../../components/LessonPopup"

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
			{ value: "lessons/", label: strings("notifications.lessons") },
			{
				value: "teacher/students",
				label: strings("notifications.students")
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
			filter:
				this.props.navigation.getParam("filter") ||
				this.filterOptions[0]["value"],
			loading: true,
			refreshing: false,
			visible: []
		}

		this._dropdownChange = this._dropdownChange.bind(this)
	}

	componentDidMount() {
		this.willFocusSubscription = this.props.navigation.addListener(
			"willFocus",
			payload => {
				this.onRefresh()
			}
		)
	}

	componentWillUnmount() {
		this.willFocusSubscription.remove()
	}

	_getItems = async (append = false) => {
		const resp = await this.props.fetchService.fetch(
			"/" +
				this.state.filter +
				"?limit=10&is_approved=false&order_by=created_at desc&page=" +
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

	onRefresh = () => {
		this.setState({ refreshing: true }, () => {
			this._getItems()
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

	approve = async (type, item, index) => {
		const id = item.id || item.student_id
		const resp = await this.props.fetchService.fetch(
			`/${type}/${id}/approve`,
			{ method: "GET" }
		)
		if (resp) {
			Alert.alert(strings(`teacher.notifications.${type}_approved`))
			let newItems = [...this.state.items]
			newItems.splice(index, 1)
			this.setState({ items: newItems })
		}
	}

	delete = async (type, item, index) => {
		const id = item.id || item.student_id
		const resp = await this.props.fetchService.fetch(`/${type}/${id}`, {
			method: "DELETE"
		})
		if (resp) {
			Alert.alert(strings(`teacher.notifications.${type}_deleted`))
			let newItems = [...this.state.items]
			newItems.splice(index, 1)
			this.setState({ items: newItems })
		}
	}

	renderLesson = ({ item, index }) => {
		const visible = this.state.visible.includes(item.id) ? true : false
		return (
			<Fragment>
				<TouchableOpacity onPress={() => this.lessonPress(item)}>
					<Notification
						style={styles.notification}
						key={`lesson${item.id}`}
						user={item.student.user}
						name={`${item.student.user.name}(${
							item.lesson_number
						})`}
						type="new_lesson"
						leftSide={
							<View>
								<Text style={styles.date}>
									{moment
										.utc(item.date)
										.local()
										.format("DD.MM")}
								</Text>
								<Text style={styles.hour}>
									<Hours
										duration={item.duration}
										date={item.date}
									/>
								</Text>
							</View>
						}
					>
						<NotificationButtons
							approve={() => this.approve("lessons", item, index)}
							edit={() =>
								this.props.navigation.navigate("Lesson", {
									lesson: item
								})
							}
							delete={() => this.delete("lessons", item, index)}
						/>
					</Notification>
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

	renderStudent = ({ item, index }) => {
		return (
			<Notification
				style={styles.notification}
				key={`student${item.student_id}`}
				name={`${item.user.name}`}
				user={item.user}
				type="new_student"
			>
				<NotificationButtons
					approve={() => this.approve("student", item, index)}
					delete={() => this.delete("student", item, index)}
				/>
			</Notification>
		)
	}

	renderPayment = ({ item, index }) => {
		return (
			<TouchableOpacity
				onPress={() =>
					this.props.navigation.navigate("StudentProfile", {
						student: item.student
					})
				}
			>
				<Notification
					style={styles.notification}
					key={`payment${item.id}`}
					leftSide={<Text style={styles.amount}>{item.amount}₪</Text>}
					name={`${item.student.user.name}`}
					user={item.student.user}
					type="new_payment"
				/>
			</TouchableOpacity>
		)
	}

	_renderItems = () => {
		if (this.state.loading) {
			return <StudentsLoader />
		}
		let render = this.renderLesson
		let type = "lesson"
		let key = "id"
		if (this.state.filter.includes("students")) {
			render = this.renderStudent
			type = "student"
			key = "student_id"
		} else if (this.state.filter.includes("payments")) {
			render = this.renderPayment
			type = "payment"
		}
		return (
			<FlatList
				data={this.state.items}
				renderItem={render}
				onEndReached={this.endReached.bind(this)}
				keyExtractor={item => `${type}${item[key]}`}
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
				items: [],
				loading: true,
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
	date: {
		fontSize: 22,
		fontFamily: "Assistant-Light"
	},
	hour: {
		fontWeight: "bold",
		fontSize: 14,
		color: "rgb(12, 116, 244)"
	},
	amount: {
		marginTop: 12,
		fontSize: 20,
		fontWeight: "bold"
	}
})

function mapStateToProps(state) {
	return {
		fetchService: state.fetchService
	}
}

export default connect(mapStateToProps)(Notifications)
