import React from "react"
import { View, Text, Button, StyleSheet, ScrollView } from "react-native"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import { Calendar } from "react-native-calendars"

class ChooseDate extends React.Component {
	render() {
		return (
			<View>
				<Calendar
					// Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
					minDate={Date()}
					// Handler which gets executed on day press. Default = undefined
					onDayPress={day => {
						console.log("selected day", day)
					}}
					// Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
					monthFormat={"MMMM"}
					// Handler which gets executed when visible month changes in calendar. Default = undefined
					onMonthChange={month => {
						console.log("month changed", month)
					}}
					// Do not show days of other months in month page. Default = false
					hideExtraDays={true}
					// Handler which gets executed when press arrow icon left. It receive a callback can go back month
					onPressArrowLeft={substractMonth => substractMonth()}
					// Handler which gets executed when press arrow icon left. It receive a callback can go next month
					onPressArrowRight={addMonth => addMonth()}
				/>
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
		paddingRight: 30,
		paddingLeft: 30,
		marginTop: 20
	},
	notification: {}
})

export default connect()(ChooseDate)
