import React, { Fragment } from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import Row from "./Row"
import Hours from "./Hours"
import { strings } from "../i18n"
import EmptyState from "./EmptyState"
import SimpleLoader from "./SimpleLoader"

export default class StudentNextLessonView extends React.Component {
	render() {
		if (this.props.loading) {
			return <SimpleLoader />
		}
		const { lesson } = this.props
		let meetup = strings("not_set")
		if (lesson.meetup_place) meetup = lesson.meetup_place.name
		if (lesson) {
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
		} else {
			return (
				<EmptyState
					image="lessons"
					text={strings("empty_lessons")}
					style={styles.empty}
					imageSize="small"
				/>
			)
		}
	}
}

const styles = StyleSheet.create({
	hoursStyle: { marginBottom: -8 },
	lessonRow: {
		marginTop: 12
	}
})
