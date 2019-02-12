import React from "react"
import {
	KeyboardAvoidingView,
	Text,
	StyleSheet,
	View,
	TouchableHighlight,
	ScrollView
} from "react-native"
import { connect } from "react-redux"
import { Input, Button } from "react-native-elements"
import { strings } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import Icon from "react-native-vector-icons/Ionicons"

class NewLesson extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			date: this.props.navigation.getParam("date"),
			hour: "",
			studentName: "",
			meetup: "",
			dropoff: "",
			topics: [],
			errors: {}
		}
	}
	render() {
		return (
			<View style={{ flex: 1 }}>
				<View style={styles.headerRow}>
					<Button
						icon={
							<Icon
								name="md-arrow-round-forward"
								size={15}
								color="white"
							/>
						}
						onPress={() => {
							this.props.navigation.goBack()
						}}
					/>
					<PageTitle
						style={styles.title}
						title={strings("teacher.new_lesson.title")}
					/>
				</View>
				<KeyboardAvoidingView
					behavior="height"
					keyboardVerticalOffset={42}
					style={styles.container}
				>
					<ScrollView
						ref={ref => (this._scrollView = ref)}
						keyboardShouldPersistTaps="always"
						style={styles.formContainer}
					>
						<Text testID="error">{this.state.error}</Text>
						<Input
							placeholder={strings("teacher.new_lesson.date")}
							onChangeText={date => this.setState({ date })}
							value={this.state.date}
							testID="lessonDateInput"
							inputContainerStyle={styles.input}
							errorMessage={this.state.errors["date"]}
							textAlign={"right"}
							autoFocus={true}
							blurOnSubmit={false}
							onSubmitEditing={() => {
								this.hourInput.focus()
							}}
						/>
						<Input
							placeholder={strings("teacher.new_lesson.hour")}
							onChangeText={hour => this.setState({ hour })}
							value={this.state.hour}
							testID="hourInput"
							inputContainerStyle={styles.input}
							errorMessage={this.state.errors["hour"]}
							textAlign={"right"}
							ref={input => {
								this.hourInput = input
							}}
							onSubmitEditing={() => {
								this.studentInput.focus()
							}}
						/>
						<Input
							placeholder={strings(
								"teacher.new_lesson.name_of_student"
							)}
							onChangeText={studentName =>
								this.setState({ studentName })
							}
							value={this.state.studentName}
							testID="studentNameInput"
							inputContainerStyle={styles.input}
							errorMessage={this.state.errors["studentName"]}
							textAlign={"right"}
							ref={input => {
								this.studentInput = input
							}}
							onSubmitEditing={() => {
								this.meetupInput.focus()
							}}
						/>
						<Input
							placeholder={strings("teacher.new_lesson.meetup")}
							onChangeText={meetup => this.setState({ meetup })}
							value={this.state.meetup}
							testID="meetupInput"
							inputContainerStyle={styles.input}
							errorMessage={this.state.errors["meetup"]}
							textAlign={"right"}
							ref={input => {
								this.meetupInput = input
							}}
							onSubmitEditing={() => {
								this.dropoffInput.focus()
								this._scrollView.scrollToEnd()
							}}
						/>
						<Input
							placeholder={strings("teacher.new_lesson.dropoff")}
							onChangeText={dropoff => this.setState({ dropoff })}
							value={this.state.dropoff}
							testID="dropoffInput"
							inputContainerStyle={styles.input}
							errorMessage={this.state.errors["dropoff"]}
							textAlign={"right"}
							ref={input => {
								this.dropoffInput = input
							}}
							onSubmitEditing={() => {
								this.topicsInput.focus()
							}}
						/>
						<Input
							placeholder={strings("teacher.new_lesson.topics")}
							onChangeText={date => this.setState({ date })}
							value={this.state.topics}
							testID="dateInput"
							inputContainerStyle={styles.input}
							errorMessage={this.state.errors["date"]}
							textAlign={"right"}
							ref={input => {
								this.topicsInput = input
							}}
							onSubmitEditing={() => {
								this._touchable.touchableHandlePress()
							}}
						/>
					</ScrollView>
					<TouchableHighlight
						ref={touchable => (this._touchable = touchable)}
					>
						<View testID="finishButton" style={styles.submitButton}>
							<Text style={styles.submitText}>></Text>
						</View>
					</TouchableHighlight>
				</KeyboardAvoidingView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	title: {
		marginLeft: 12
	},
	headerRow: {
		flexDirection: "row",
		flex: 1,
		maxHeight: 60
	},
	formContainer: {
		width: 340,
		maxWidth: 340,
		alignSelf: "center"
	},
	submitButton: {
		position: "absolute",
		bottom: 0,
		backgroundColor: "rgb(12,116,244)",
		height: 56,
		width: "100%",
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center"
	},
	submitText: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "bold"
	},
	input: {
		borderBottomColor: "rgb(200,200,200)",
		borderBottomWidth: 1,
		paddingBottom: 8,
		marginTop: 24
	}
})

export default connect()(NewLesson)
