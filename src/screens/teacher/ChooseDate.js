import React from "react"
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	FlatList
} from "react-native"
import { connect } from "react-redux"
import { strings, dates } from "../../i18n"
import { CalendarList } from "react-native-calendars"
import ShadowRect from "../../components/ShadowRect"
import Row from "../../components/Row"
import UserWithPic from "../../components/UserWithPic"
import Separator from "../../components/Separator"
import { Icon } from "react-native-elements"
import {
	MAIN_PADDING,
	calendarTheme,
	fullButton,
	SHORT_API_DATE_FORMAT
} from "../../consts"
import Hours from "../../components/Hours"
import { getDateAndString } from "../../actions/lessons"
import EmptyState from "../../components/EmptyState"
import LessonsLoader from "../../components/LessonsLoader"
import moment from "moment"

export class ChooseDate extends React.Component {
	constructor(props) {
		super(props)
		const date = new Date()
		this.state = {
			day: date,
			selected: date.toJSON().slice(0, 10),
			items: [],
			loading: true
		}
		this._getItems(date)
		this.onDayPress = this.onDayPress.bind(this)
	}
	componentDidMount() {
		this.willFocusSubscription = this.props.navigation.addListener(
			"willFocus",
			payload => {
				this._getItems(this.state.day)
			}
		)
	}

	componentWillUnmount() {
		this.willFocusSubscription.remove()
	}

	renderArrow = direction => (
		<Icon
			name={
				direction === "left"
					? "keyboard-arrow-right"
					: "keyboard-arrow-left"
			}
			type="material"
		/>
	)
	renderItem = ({ item, index }) => {
		let student = strings("teacher.no_student_applied")
		if (item.student) {
			student = item.student.name
		}
		return (
			<Row
				key={`item${item.id}`}
				style={styles.lessonRow}
				leftSide={
					<Hours
						style={styles.hours}
						duration={item.duration}
						date={item.date}
					/>
				}
			>
				<UserWithPic
					name={student}
					user={item.student}
					nameStyle={styles.nameStyle}
					width={42}
					height={42}
				/>
			</Row>
		)
	}
	_getItems = async date => {
		const dateObject = getDateAndString(date)
		const resp = await this.props.fetchService.fetch(
			"/appointments/?is_approved=true&date=ge:" +
				dateObject.date.startOf("day").toISOString() +
				"&date=le:" +
				dateObject.date.endOf("day").toISOString(),
			{ method: "GET" }
		)
		this.setState({
			items: resp.json["data"],
			loading: false
		})
	}
	onDayPress = day => {
		this.setState(
			{
				day: day,
				selected: day.dateString,
				loading: true
			},
			() => {
				this._getItems(day)
			}
		)
	}

	_renderEmpty = () => (
		<EmptyState
			image="lessons"
			text={strings("empty_lessons")}
			imageSize="small"
		/>
	)

	_renderLessons = () => {
		if (this.state.loading) {
			return (
				<View style={styles.listLoader}>
					<LessonsLoader width={340} />
				</View>
			)
		}
		return (
			<FlatList
				ItemSeparatorComponent={() => <Separator />}
				ListEmptyComponent={this._renderEmpty}
				testID="scheduleList"
				data={this.state.items}
				renderItem={this.renderItem}
				style={styles.flatList}
				keyExtractor={item => `item${item.id}`}
			/>
		)
	}
	render() {
		return (
			<View style={styles.container}>
				<CalendarList
					current={this.state.selected || new Date()}
					style={styles.calendar}
					theme={calendarTheme}
					// Enable horizontal scrolling, default = false
					horizontal={true}
					// Enable paging on horizontal, default = false
					pagingEnabled={true}
					// Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
					minDate={new Date().getDate() - 14}
					maxDate={moment()
						.add(4, "months")
						.format(SHORT_API_DATE_FORMAT)}
					markedDates={{
						[this.state.selected]: {
							selected: true,
							disableTouchEvent: true
						}
					}}
					// Handler which gets executed on day press. Default = undefined
					onDayPress={this.onDayPress}
					// Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
					monthFormat={"MMMM yy"}
					renderArrow={this.renderArrow}
					hideArrows={false}
					// Do not show days of other months in month page.
					hideExtraDays={false}
				/>
				<View style={styles.scheduleContainer}>
					<Text testID="dateString" style={styles.scheduleTitle}>
						{dates("date.formats.short", this.state.selected)}
					</Text>
					<ShadowRect style={styles.schedule}>
						{this._renderLessons()}
					</ShadowRect>
				</View>
				<TouchableOpacity
					onPress={() => {
						this.props.navigation.navigate("Lesson", {
							date: this.state.selected
						})
					}}
					style={fullButton}
					testID="continueButton"
				>
					<Text style={styles.buttonText}>
						{strings("teacher.new_lesson.continue")}
					</Text>
				</TouchableOpacity>
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
	scheduleContainer: {
		flex: 1,
		marginTop: 20
	},
	scheduleTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "rgb(121, 121, 121)",
		alignSelf: "flex-start",
		marginLeft: MAIN_PADDING
	},
	schedule: {
		flex: 1,
		marginTop: 24
	},
	hours: {
		marginTop: 4
	},
	nameStyle: {
		fontSize: 18,
		marginTop: 4
	},
	lessonRow: {
		marginTop: 12
	},
	buttonText: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "bold"
	},
	flatList: {
		flex: 1,
		marginBottom: 40,
		alignSelf: "center",
		width: "100%"
	}
})

mapStateToProps = state => {
	return {
		fetchService: state.fetchService
	}
}
export default connect(mapStateToProps)(ChooseDate)
