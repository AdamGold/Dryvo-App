import React, { Fragment } from "react"
import {
	View,
	Text,
	TouchableHighlight,
	StyleSheet,
	FlatList
} from "react-native"
import { connect } from "react-redux"
import { strings, dates } from "../../i18n"
import { Agenda } from "react-native-calendars"
import Row from "../../components/Row"
import UserWithPic from "../../components/UserWithPic"
import { Icon } from "react-native-elements"
import Separator from "../../components/Separator"
import { calendarTheme, MAIN_PADDING } from "../../consts"
import moment from "moment"

export class Schedule extends React.Component {
	static navigationOptions = () => {
		return {
			title: "schedule",
			tabBarLabel: strings("tabs.schedule"),
			tabBarAccessibilityLabel: strings("tabs.schedule"),
			tabBarTestID: "ScheduleTab"
		}
	}
	constructor(props) {
		super(props)
		const date = new Date()
		this.state = {
			selected: date.toJSON().slice(0, 10),
			items: {}
		}
		this._getItems(date)
	}

	_getItems = async date => {
		console.log(date)
		let timestamp
		let dateString
		if (date.hasOwnProperty("timestamp")) {
			timestamp = date.timestamp
			dateString = date.dateString
		} else {
			timestamp = date.getTime()
			dateString = date.toJSON().slice(0, 10)
		}
		const startOfDay = moment
			.unix(timestamp / 1000) // division by 1000 to get epoch https://stackoverflow.com/questions/3367415/get-epoch-for-a-specific-date-using-javascript
			.utc()
			.startOf("day")
		const endOfDay = moment
			.unix(timestamp / 1000)
			.utc()
			.endOf("day")
		const resp = await this.props.fetchService.fetch(
			"/lessons/?is_approved=true&date=ge:" +
				startOfDay.toISOString() +
				"&date=le:" +
				endOfDay.toISOString(),
			{ method: "GET" }
		)
		if (!resp.json["data"]) return
		this.setState(prevState => ({
			items: {
				...prevState.items,
				[dateString]: resp.json["data"]
			}
		}))
	}

	renderItem = (item, firstItemInDay) => {
		let style = {}
		if (firstItemInDay) {
			style = { marginTop: 20 }
		}
		const date = item.date
		let dropoff
		let meetup
		if (item.dropoff_place) {
			dropoff = (
				<Text style={styles.places}>
					{strings("teacher.new_lesson.dropoff")}:{" "}
					{droitem.dropoff_place.namepoff}
				</Text>
			)
		}
		if (item.meetup_place) {
			meetup = (
				<Text style={styles.places}>
					{strings("teacher.new_lesson.meetup")}:{" "}
					{item.meetup_place.name}
				</Text>
			)
		}
		return (
			<Row
				style={{ ...styles.row, ...style }}
				leftSide={
					<Text style={styles.hour}>
						{moment(date).format("HH:mm")} -{" "}
						{moment(date)
							.add(item.duration, "minutes")
							.format("HH:mm")}
					</Text>
				}
			>
				<UserWithPic
					name={`${item.student.user.name}(${item.lesson_number})`}
					imageContainerStyle={styles.imageContainerStyle}
					extra={
						<Fragment>
							{meetup}
							{dropoff}
						</Fragment>
					}
					nameStyle={styles.nameStyle}
					width={44}
					height={44}
					style={styles.userWithPic}
				/>
			</Row>
		)
	}

	renderKnob = () => {
		return (
			<View>
				<TouchableHighlight>
					<View>
						<Icon
							size={20}
							color="rgb(12, 116, 244)"
							name="add-circle"
							type="material"
						/>
						<Text style={styles.calendarText}>
							{strings("teacher.schedule.calendar")}
						</Text>
					</View>
				</TouchableHighlight>
				<Separator />
			</View>
		)
	}

	renderEmpty = () => {
		return <Text>Hello empty</Text>
	}
	render() {
		return (
			<View style={styles.container}>
				<View testID="ScheduleView" style={styles.schedule}>
					<Agenda
						items={this.state.items}
						// callback that gets called on day press
						onDayPress={day => {
							this.setState(
								{
									selected: day.dateString
								},
								() => {
									this._getItems(day)
								}
							)
						}}
						// initially selected day
						selected={Date()}
						// Max amount of months allowed to scroll to the past. Default = 50
						pastScrollRange={50}
						// Max amount of months allowed to scroll to the future. Default = 50
						futureScrollRange={50}
						// specify how each item should be rendered in agenda
						renderItem={this.renderItem}
						// specify how each date should be rendered. day can be undefined if the item is not first in that day.
						renderDay={(day, item) => undefined}
						renderEmptyDate={this.renderEmpty}
						// specify your item comparison function for increased performance
						rowHasChanged={(r1, r2) => {
							return r1.text !== r2.text
						}}
						markedDates={{
							[this.state.selected]: {
								selected: true
							}
						}}
						showOnlyDaySelected={true}
						// agenda theme
						theme={{
							...calendarTheme,
							backgroundColor: "transparent",
							agendaKnobColor: "gray",
							textWeekDayFontSize: 16,
							textWeekDayFontWeight: "600"
						}}
						ItemSeparatorComponent={() => <Separator />}
					/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	calendar: {
		flex: 1
	},
	header: {
		flex: 1,
		alignItems: "center",
		maxHeight: 100
	},
	calendarText: {
		fontWeight: "bold",
		color: "rgb(12,116,244)",
		marginTop: 6
	},
	schedule: {
		flex: 1,
		paddingRight: MAIN_PADDING,
		paddingLeft: MAIN_PADDING,
		marginTop: 20
	},
	row: {},
	imageContainerStyle: { marginTop: 10 },
	places: {
		fontSize: 14,
		color: "gray",
		marginTop: 4,
		alignSelf: "flex-start"
	},
	nameStyle: {
		marginTop: -4
	},
	hour: {
		fontSize: 20,
		color: "gray",
		marginTop: -12
	},
	userWithPic: { marginLeft: 10 }
})

mapStateToProps = state => {
	return {
		fetchService: state.fetchService
	}
}
export default connect(mapStateToProps)(Schedule)
