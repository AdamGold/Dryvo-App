import React, { Fragment } from "react"
import {
	View,
	Text,
	TouchableHighlight,
	StyleSheet,
	TouchableOpacity
} from "react-native"
import { connect } from "react-redux"
import { strings, dates } from "../../i18n"
import { Agenda } from "react-native-calendars"
import Row from "../../components/Row"
import { Icon } from "react-native-elements"
import Separator from "../../components/Separator"
import {
	calendarTheme,
	MAIN_PADDING,
	colors,
	NAME_LENGTH,
	SHORT_API_DATE_FORMAT
} from "../../consts"
import Hours from "../../components/Hours"
import { getDateAndString } from "../../actions/lessons"
import LessonPopup from "../../components/LessonPopup"
import EmptyState from "../../components/EmptyState"
import LessonsLoader from "../../components/LessonsLoader"
import moment from "moment"
import UserPic from "../../components/UserPic"

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
			date,
			selected: date.toJSON().slice(0, 10),
			items: {},
			visible: [],
			refreshing: false
		}

		this.onDayPress = this.onDayPress.bind(this)
	}

	componentDidMount() {
		this.willFocusSubscription = this.props.navigation.addListener(
			"willFocus",
			payload => {
				this._getItems(this.state.date)
			}
		)
	}

	componentWillUnmount() {
		this.willFocusSubscription.remove()
	}

	_onRefresh = () => {
		this.setState({ refreshing: true }, () => {
			this._getItems(this.state.date)
		})
	}

	_getWorkDayHours(data) {
		let hours = []
		const offset = moment().utcOffset() / 60
		data.forEach(day => {
			hours.push(day.from_hour + offset)
			hours.push(day.to_hour + offset)
		})

		return hours
	}

	async _getDayHours() {
		// first try to get the work hours on this specific day
		let resp = await this.props.fetchService.fetch(
			"/teacher/work_days?on_date=" +
				moment(this.state.date).format(SHORT_API_DATE_FORMAT),
			{
				method: "GET"
			}
		)

		if (resp) {
			if (resp.json.data.length == 0) {
				// if no data, try to get global work hours for this day
				const weekDay = moment(this.state.date).day()
				resp = await this.props.fetchService.fetch(
					"/teacher/work_days?day=" + weekDay,
					{
						method: "GET"
					}
				)
			}
		}
		if (!resp) return []
		return this._getWorkDayHours(resp.json.data)
	}

	async _createDayTimeline(lessons) {
		// create a dictionary consisting of:
		// HOUR: [lessons]
		// for every hour of the day, starting from first working hour to last
		let day = {}
		const workDaysHours = await this._getDayHours()
		if (workDaysHours.length > 0) {
			for (
				let hour = Math.min(...workDaysHours);
				hour <= Math.max(...workDaysHours);
				hour++
			) {
				day[hour] = []
			}
		}

		lessons.forEach(lesson => {
			const hour = moment(lesson.date).hours()
			const endingHour = moment(lesson.date)
				.add(lesson.duration, "minutes")
				.hours()
			for (let i = hour + 1; i <= endingHour; i++) {
				// if the lesson ends in X hours, delete all these hours from our object
				// if later there are lessons with these hours, we re-add them
				delete day[i]
			}
			if (day.hasOwnProperty(hour)) {
				day[hour].push(lesson)
			} else {
				day[hour] = [lesson]
			}
		})

		return day
	}

	_getItems = async date => {
		const dates = getDateAndString(date)
		const resp = await this.props.fetchService.fetch(
			"/lessons/?is_approved=true&date=ge:" +
				dates.date.startOf("day").toISOString() +
				"&date=le:" +
				dates.date.endOf("day").toISOString(),
			{ method: "GET" }
		)
		if (!resp.json["data"]) return
		const timeline = await this._createDayTimeline(resp.json["data"])
		this.setState(prevState => ({
			items: {
				...prevState.items,
				[dates.dateString]: [timeline]
			},
			refreshing: false
		}))
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

	_renderLesson(item) {
		let student = strings("teacher.no_student_applied")
		let user = null
		if (item.student) {
			student =
				item.student.user.name.slice(0, NAME_LENGTH) +
				" " +
				strings("teacher.schedule.lesson_number", {
					num: item.lesson_number
				})
			user = item.student.user
		}
		const date = item.date
		let meetup = strings("not_set")
		if (item.meetup_place) meetup = item.meetup_place.name
		let dropoff = strings("not_set")
		if (item.dropoff_place) dropoff = item.dropoff_place.name
		const visible = this.state.visible.includes(item.id) ? true : false
		return (
			<Fragment key={item.id}>
				<TouchableOpacity onPress={() => this.lessonPress(item)}>
					<Row
						style={styles.row}
						leftSide={
							<UserPic
								user={user}
								style={styles.imageStyle}
								width={44}
								height={44}
							/>
						}
					>
						<Hours
							style={styles.hours}
							duration={item.duration}
							date={date}
						/>
						<Text style={styles.name}>{student}</Text>
						<Text style={styles.places}>
							{strings("teacher.new_lesson.meetup")}:{" "}
							{meetup.slice(0, 20)}
						</Text>
						<Text style={styles.places}>
							{strings("teacher.new_lesson.dropoff")}:{" "}
							{dropoff.slice(0, 20)}
						</Text>
					</Row>
				</TouchableOpacity>
				<LessonPopup
					visible={visible}
					item={item}
					onPress={this.lessonPress}
					navigation={this.props.navigation}
				/>
			</Fragment>
		)
	}

	_renderLessons(lessons) {
		if (lessons.length == 0) {
			return (
				<Text style={styles.emptyHour}>
					{strings("teacher.schedule.no_lessons_in_hour")}
				</Text>
			)
		}
		return lessons.map((item, index) => {
			return this._renderLesson(item)
		})
	}

	renderHours = (hoursDict, firstItemInDay) => {
		// hoursDict is actually an object containing hours, each with a list of lessons
		if (Object.entries(hoursDict).length === 0) {
			return this._renderEmpty()
		}
		return Object.keys(hoursDict).map((hour, index) => {
			const lessons = hoursDict[hour]
			let firstStyle = {}
			if (index == 0) {
				firstStyle = { borderTopWidth: 0 }
			}
			return (
				<View
					style={{ ...styles.hourView, ...firstStyle }}
					key={`${hour}-${index}`}
				>
					<Text style={styles.hourTitle}>{hour}:00</Text>
					<View style={styles.hourLessons}>
						{this._renderLessons(lessons, firstItemInDay)}
					</View>
				</View>
			)
		})
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

	_renderEmpty = () => {
		return (
			<EmptyState
				image="lessons"
				text={strings("empty_work_hours")}
				style={styles.empty}
			/>
		)
	}

	onDayPress = day => {
		this.setState(
			{
				date: new Date(day.timestamp),
				selected: day.dateString
			},
			() => {
				this._getItems(day)
			}
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<View testID="ScheduleView" style={styles.schedule}>
					<TouchableOpacity
						onPress={() =>
							this.props.navigation.navigate("WorkDays", {
								fromSchedule: true
							})
						}
					>
						<Text style={styles.workDays}>
							{strings("teacher.schedule.change_work_days")}
						</Text>
					</TouchableOpacity>
					<Agenda
						items={this.state.items}
						// callback that gets called on day press
						onDayPress={this.onDayPress}
						// initially selected day
						selected={Date()}
						// Max amount of months allowed to scroll to the past. Default = 50
						pastScrollRange={12}
						// Max amount of months allowed to scroll to the future. Default = 50
						futureScrollRange={4}
						// specify how each item should be rendered in agenda
						renderItem={this.renderHours}
						// specify how each date should be rendered. day can be undefined if the item is not first in that day.
						renderDay={(day, item) => undefined}
						renderEmptyDate={this._renderEmpty}
						renderEmptyData={() => {
							return <LessonsLoader width={340} />
						}}
						// specify your item comparison function for increased performance
						rowHasChanged={(r1, r2) => {
							return r1.text !== r2.text || this.state.visible
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
							textWeekDayFontWeight: "600",
							"stylesheet.calendar.header": {
								monthText: { marginTop: 20 }
							}
						}}
						ItemSeparatorComponent={() => <Separator />}
						extraData={this.state.visible}
						// If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
						onRefresh={this._onRefresh.bind(this)}
						// Set this true while waiting for new data from a refresh
						refreshing={this.state.refreshing}
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
	workDays: {
		color: colors.blue,
		alignSelf: "center"
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
	row: {
		marginTop: 12,
		backgroundColor: "#f4f4f4",
		padding: 8
	},
	imageStyle: { marginTop: 20, marginRight: 6 },
	places: {
		fontSize: 14,
		color: "gray",
		marginTop: 4,
		alignSelf: "flex-start"
	},
	hours: { fontWeight: "bold", alignSelf: "flex-start" },
	hourView: {
		flexDirection: "row",
		flex: 1,
		borderTopColor: "rgb(212, 212, 212)",
		borderTopWidth: 1,
		paddingBottom: 16,
		paddingTop: 16
	},
	hourTitle: {
		alignSelf: "flex-start",
		fontWeight: "bold",
		fontSize: 18,
		flex: 1
	},
	hourLessons: {
		flex: 5,
		marginLeft: 12
	},
	name: {
		alignSelf: "flex-start",
		flex: 1
	},
	emptyHour: {
		alignSelf: "flex-start"
	},
	empty: {
		marginTop: 100
	}
})

function mapStateToProps(state) {
	return {
		fetchService: state.fetchService
	}
}
export default connect(mapStateToProps)(Schedule)
