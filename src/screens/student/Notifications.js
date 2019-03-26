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
import { MAIN_PADDING } from "../../consts"
import { Dropdown } from "react-native-material-dropdown"
import EmptyState from "../../components/EmptyState"
import StudentsLoader from "../../components/StudentsLoader"
import Notification from "../../components/Notification"
import moment from "moment"

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
			loading: true
		}

		this._dropdownChange = this._dropdownChange.bind(this)

		this._getItems()
	}

	_getItems = async (append = false) => {
		const resp = await this.props.fetchService.fetch(
			"/" +
				this.state.filter +
				"?limit=20&order_by=created_at desc&page=" +
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
			nextUrl: resp.nextUrl,
			loading: false
		})
	}

	renderPayment = ({ item, index }) => {
		console.log(item.created_at)
		return (
			<Notification
				style={styles.notification}
				key={`payment${item.id}`}
				leftSide={<Text style={styles.amount}>{item.amount}₪</Text>}
				basic={true}
				date={moment.utc(item.created_at).format("DD.MM.YY, HH:mm")}
				basicStyle={styles.date}
			/>
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
				onEndReached={this.endReached}
				keyExtractor={item => `${type}${item.id}`}
				ListEmptyComponent={this._renderEmpty}
				extraData={this.state.visible}
			/>
		)
	}

	endReached = () => {
		if (!this.state.nextUrl) return
		this.setState(
			{
				page: this.state.page + 1
			},
			() => {
				this._getItems(true)
			}
		)
	}

	_dropdownChange = (value, index, data) => {
		this.setState(
			{
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
	date: {
		marginTop: 10,
		fontSize: 18
	}
})

function mapStateToProps(state) {
	return {
		fetchService: state.fetchService
	}
}

export default connect(mapStateToProps)(Notifications)
