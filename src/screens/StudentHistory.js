import React, { Fragment } from "react"
import {
	View,
	StyleSheet,
	ScrollView,
	Text,
	FlatList,
	TouchableOpacity
} from "react-native"
import { connect } from "react-redux"
import { strings } from "../i18n"
import PageTitle from "../components/PageTitle"
import { Button, Icon } from "react-native-elements"
import { MAIN_PADDING, colors } from "../consts"
import LessonsLoader from "../components/LessonsLoader"
import EmptyState from "../components/EmptyState"
import LessonPopup from "../components/LessonPopup"
import { getRole } from "../actions/auth"
import Hours from "../components/Hours"

export class StudentHistory extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			appointments: [],
			loading: true,
			visible: []
		}
		this.isTeacher = false
		if (getRole(this.props.user) == "teacher") {
			this.isTeacher = true
		}
		this._getAppointments()
	}

	_getAppointments = async () => {
		const resp = await this.props.fetchService.fetch(
			"/appointments/?is_approved=true&student_id=" +
				this.props.navigation.getParam("student_id"),
			{
				method: "GET"
			}
		)
		console.log(resp.json.data)
		this.setState({
			appointments: resp.json.data,
			loading: false
		})
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

	renderItem = ({ item, index }) => {
		const date = item.date
		const meetup = item.meetup_place || strings("not_set")
		const dropoff = item.dropoff_place || strings("not_set")
		const visible = this.state.visible.includes(item.id) ? true : false
		let approved = ""
		if (!item.is_approved) {
			approved = " - " + strings("not_approved")
		}
		let lessonTitle =
			strings("teacher.home.lesson_number") +
			" " +
			item.lesson_number +
			approved

		if (item.type != "lesson") {
			lessonTitle = strings("teacher.new_lesson.types." + item.type)
		}
		return (
			<Fragment>
				<View style={styles.lesson}>
					<TouchableOpacity onPress={() => this.lessonPress(item)}>
						<Text style={styles.lessonTitle}>{lessonTitle}</Text>
						<Hours
							duration={item.duration}
							date={date}
							style={styles.hours}
						/>
						<Text style={styles.places}>
							{strings("teacher.new_lesson.meetup")}: {meetup},{" "}
							{strings("teacher.new_lesson.dropoff")}: {dropoff}
						</Text>
					</TouchableOpacity>
				</View>
				<LessonPopup
					visible={visible}
					item={item}
					onPress={this.lessonPress.bind(this)}
					navigation={this.props.navigation}
					isStudent={!this.isTeacher}
				/>
			</Fragment>
		)
	}

	_renderEmpty = () => {
		if (this.state.loading) return <View />
		return (
			<EmptyState
				image="lessons"
				text={strings("empty_lessons")}
				style={styles.empty}
			/>
		)
	}

	render() {
		let loading
		if (this.state.loading) {
			loading = <LessonsLoader />
		}
		return (
			<ScrollView style={{ flex: 1 }}>
				<View style={styles.container}>
					<View style={styles.headerRow}>
						<Button
							icon={<Icon name="arrow-forward" type="material" />}
							onPress={() => {
								this.props.navigation.goBack()
							}}
							type="clear"
							style={{ marginTop: -6 }}
						/>
						<PageTitle
							style={styles.title}
							title={strings("student_profile.lessons_history")}
						/>
					</View>
					{loading}
					<FlatList
						data={this.state.appointments}
						renderItem={this.renderItem.bind(this)}
						keyExtractor={item => `${item.id}`}
						ListEmptyComponent={this._renderEmpty}
						extraData={this.state.visible}
					/>
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: MAIN_PADDING,
		marginVertical: MAIN_PADDING
	},
	headerRow: {
		flexDirection: "row"
	},
	lesson: {
		flex: 1,
		marginTop: 12,
		backgroundColor: "#f4f4f4",
		padding: 8
	},
	lessonTitle: {
		color: colors.blue,
		alignSelf: "flex-start"
	},
	places: {
		fontSize: 14,
		color: "gray",
		marginTop: 4,
		alignSelf: "flex-start",
		textAlign: "left"
	},
	hours: {
		fontSize: 14,
		color: "gray",
		alignSelf: "flex-start"
	}
})

function mapStateToProps(state) {
	return {
		error: state.error,
		fetchService: state.fetchService,
		user: state.user
	}
}

export default connect(mapStateToProps)(StudentHistory)
