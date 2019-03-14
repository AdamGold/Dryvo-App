import React, { Fragment } from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import Row from "./Row"
import Hours from "./Hours"
import { strings } from "../i18n"

export default class StudentNextLessonView extends React.Component {
	render() {
		const { lesson } = this.props
		let meetup = strings("not_set")
		if (lesson.meetup_place) meetup = lesson.meetup_place.name
		return (
			<TouchableOpacity
				onPress={this.props.lessonPress}
				testID={this.props.testID}
			>
				<Row
					style={styles.lessonRow}
					leftSide={
						<Hours
							duration={lesson.duration}
							date={lesson.date}
							style={styles.hoursStyle}
						/>
					}
				>
					<Text style={styles.placeStyle}>
						{strings("teacher.new_lesson.meetup")}: {meetup}
					</Text>
				</Row>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	hoursStyle: { marginBottom: -8 },
	lessonRow: {
		marginTop: 12
	}
})
