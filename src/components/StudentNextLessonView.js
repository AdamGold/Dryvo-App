import React, { Fragment } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Row from "./Row"
import Hours from "./Hours"
import { strings } from "../i18n"
import EmptyState from "./EmptyState"
import SimpleLoader from "./SimpleLoader"
import moment from "moment"
import { DATE_FORMAT, NAME_LENGTH } from "../consts"

export default class StudentNextLessonView extends React.Component {
	render() {
		if (this.props.loading) {
			return <SimpleLoader />
		}
		const { lesson } = this.props
		const meetup = lesson.meetup_place || strings("not_set")
		const dropoff = lesson.dropoff_place || strings("not_set")
		if (lesson) {
			return (
				<TouchableOpacity
					onPress={this.props.lessonPress}
					testID={this.props.testID}
				>
					<Fragment>
						<Row
							style={styles.lessonRow}
							leftSide={
								<View style={styles.dateView}>
									<Text style={styles.date}>
										{moment
											.utc(lesson.date)
											.local()
											.format(DATE_FORMAT)}
									</Text>
									<Hours
										duration={lesson.duration}
										date={lesson.date}
										style={styles.hoursStyle}
									/>
								</View>
							}
						>
							<Text style={styles.placeStyle}>
								{strings("teacher.new_lesson.meetup")}:{" "}
								{meetup.slice(0, NAME_LENGTH)}
							</Text>
							<Text style={styles.placeStyle}>
								{strings("teacher.new_lesson.dropoff")}:{" "}
								{dropoff.slice(0, NAME_LENGTH)}
							</Text>
						</Row>
					</Fragment>
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
	dateView: { marginTop: -8 },
	placeStyle: { alignSelf: "flex-start" },
	date: {
		fontFamily: "Assistant-Light",
		fontSize: 24
	},
	hoursStyle: { fontWeight: "bold", alignSelf: "center" },
	lessonRow: {
		marginTop: 12
	}
})
