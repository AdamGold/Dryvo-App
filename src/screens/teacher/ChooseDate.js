import React from "react"
import {
	View,
	Text,
	TouchableHighlight,
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
import { MAIN_PADDING, calendarTheme, floatButton } from "../../consts"
import Hours from "../../components/Hours"
import { getStartAndEndOfDay } from "../../actions/lessons"

export class ChooseDate extends React.Component {
	constructor(props) {
		super(props)
		const date = new Date()
		this.state = {
			selected: date.toJSON().slice(0, 10),
			items: []
		}
		this._getItems(date)
		this.onDayPress = this.onDayPress.bind(this)
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
	renderItem = ({ item, index }) => (
		<Row
			key={`item${item.id}`}
			style={styles.lessonRow}
			leftSide={<Hours duration={item.duration} date={item.date} />}
		>
			<UserWithPic
				name={item.title}
				nameStyle={styles.nameStyle}
				width={42}
				height={42}
			/>
		</Row>
	)
	_getItems = async date => {
		const dates = getStartAndEndOfDay(date)
		const resp = await this.props.fetchService.fetch(
			"/lessons/?is_approved=true&date=ge:" +
				dates.startOfDay.toISOString() +
				"&date=le:" +
				dates.endOfDay.toISOString(),
			{ method: "GET" }
		)
		this.setState({
			items: resp.json["data"]
		})
	}
	onDayPress = day => {
		this.setState(
			{
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
				<CalendarList
					style={styles.calendar}
					theme={calendarTheme}
					// Enable horizontal scrolling, default = false
					horizontal={true}
					// Enable paging on horizontal, default = false
					pagingEnabled={true}
					// Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
					minDate={Date()}
					markedDates={{
						[this.state.selected]: {
							selected: true,
							disableTouchEvent: true
						}
					}}
					// Handler which gets executed on day press. Default = undefined
					onDayPress={this.onDayPress}
					// Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
					monthFormat={"MMMM"}
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
						<FlatList
							ItemSeparatorComponent={() => <Separator />}
							testID="scheduleList"
							data={this.state.items}
							renderItem={this.renderItem}
						/>
					</ShadowRect>
				</View>
				<TouchableHighlight
					underlayColor="#ffffff00"
					onPress={() => {
						this.props.navigation.navigate("NewLesson", {
							date: this.state.selected
						})
					}}
				>
					<View testID="continueButton" style={styles.floatButton}>
						<Text style={styles.buttonText}>
							{strings("teacher.new_lesson.continue")}
						</Text>
					</View>
				</TouchableHighlight>
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
	schedule: { minHeight: 230, marginTop: 24 },
	hour: {
		marginTop: -2,
		color: "rgb(12,116,244)"
	},
	nameStyle: {
		fontSize: 18,
		marginTop: 4
	},
	lessonRow: {
		marginTop: 12
	},
	floatButton: floatButton,
	buttonText: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "bold"
	}
})

mapStateToProps = state => {
	return {
		fetchService: state.fetchService
	}
}
export default connect(mapStateToProps)(ChooseDate)
