import React from "react"
import {
	View,
	Text,
	TouchableHighlight,
	StyleSheet,
	FlatList
} from "react-native"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import { CalendarList } from "react-native-calendars"
import ShadowRect from "../../components/ShadowRect"
import LessonRow from "../../components/LessonRow"
import UserWithPic from "../../components/UserWithPic"
import Separator from "../../components/Separator"

class ChooseDate extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selected: Date().toString()
		}
	}
	render() {
		return (
			<View style={styles.container}>
				<CalendarList
					style={styles.calendar}
					theme={{
						textSectionTitleColor: "#000",
						dayTextColor: "#000",
						textDisabledColor: "rgb(155,155,155)",
						textDayFontFamily: "Assistant",
						textMonthFontFamily: "Assistant",
						textDayHeaderFontFamily: "Assistant",
						todayTextColor: "#000",
						selectedDayTextColor: "#fff",
						selectedDayBackgroundColor: "rgb(12,116,244)",
						textMonthFontWeight: "bold",
						textDayFontWeight: "500",
						selectedDayfontWeight: "bold",
						textDayFontSize: 16,
						textMonthFontSize: 16,
						textDayHeaderFontSize: 16
					}}
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
					onDayPress={day => {
						this.setState({
							selected: day.dateString
						})
					}}
					// Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
					monthFormat={"MMMM"}
					// Handler which gets executed when visible month changes in calendar. Default = undefined
					onMonthChange={month => {
						console.log("month changed", month)
					}}
					// Handler which gets executed when press arrow icon left. It receive a callback can go back month
					onPressArrowLeft={substractMonth => substractMonth()}
					// Handler which gets executed when press arrow icon left. It receive a callback can go next month
					onPressArrowRight={addMonth => addMonth()}
					// Hide month navigation arrows. Default = false
					hideArrows={false}
					// Do not show days of other months in month page. Default = false
					hideExtraDays={false}
					renderArrow={direction => (
						<Icon
							name={
								direction === "left"
									? "arrow-forward"
									: "arrow-back"
							}
						/>
					)}
				/>
				<View style={styles.scheduleContainer}>
					<Text style={styles.scheduleTitle}>9 בינואר 2019</Text>
					<ShadowRect style={styles.schedule}>
						<FlatList
							ItemSeparatorComponent={() => <Separator />}
							data={[
								{ title: "רועי ונונו", key: "item1" },
								{ title: "דוד אמסלם", key: "item2" }
							]}
							renderItem={({ item }) => (
								<LessonRow style={styles.lessonRow}>
									<UserWithPic
										name={item.title}
										nameStyle={styles.nameStyle}
									/>
									<Text style={styles.hour}>13:00-13:40</Text>
								</LessonRow>
							)}
						/>
					</ShadowRect>
				</View>
				<TouchableHighlight
					onPress={() => {
						this.props.navigation.navigate("NewLesson", {
							date: this.state.selected
						})
					}}
				>
					<View style={styles.floatButton}>
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
		marginLeft: 26
	},
	schedule: { minHeight: 230, marginTop: 24 },
	hour: {
		flex: 1,
		marginRight: "auto",
		marginTop: -8,
		color: "rgb(12,116,244)"
	},
	nameStyle: {
		fontSize: 18,
		marginTop: 4
	},
	lessonRow: {
		marginTop: 12
	},
	floatButton: {
		position: "absolute",
		bottom: 22,
		backgroundColor: "rgb(12,116,244)",
		width: 280,
		height: 56,
		borderRadius: 28,
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "rgb(12,116,244)",
		shadowOffset: {
			width: 0,
			height: 8
		},
		shadowOpacity: 0.5,
		shadowRadius: 16,
		elevation: 8
	},
	buttonText: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "bold"
	}
})

export default connect()(ChooseDate)
