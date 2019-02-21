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
		this.state = {
			selected: new Date().toJSON().slice(0, 10)
		}
	}

	renderItem = (item, firstItemInDay) => {
		let style = {}
		if (firstItemInDay) {
			style = { marginTop: 20 }
		}
		return (
			<Row
				style={{ ...styles.row, ...style }}
				leftSide={<Text style={styles.hour}>10:00-10:40</Text>}
			>
				<UserWithPic
					name="רונן רוזנטל (שיעור 25)"
					imageContainerStyle={styles.imageContainerStyle}
					extra={
						<Fragment>
							<Text style={styles.places}>
								{strings("teacher.new_lesson.meetup")}: האומן 5
							</Text>
							<Text style={styles.places}>
								{strings("teacher.new_lesson.dropoff")}: רוטשילד
							</Text>
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
	render() {
		return (
			<View style={styles.container}>
				<View testID="ScheduleView" style={styles.schedule}>
					<Agenda
						items={{
							"2019-02-19": [
								{ text: "item 1 - any js object" },
								{ text: "item 1 - any js object" }
							],
							"2019-02-20": [{ text: "item 3 - any js object" }]
						}}
						// callback that fires when the calendar is opened or closed
						onCalendarToggled={calendarOpened => {
							console.log(calendarOpened)
						}}
						// callback that gets called on day press
						onDayPress={day => {
							this.setState({
								selected: day.dateString
							})
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
						// specify what should be rendered instead of ActivityIndicator
						renderEmptyData={() => {
							return <Text>Hello empty</Text>
						}}
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
export default connect()(Schedule)
