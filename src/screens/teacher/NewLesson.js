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
import { Input, Button, Icon } from "react-native-elements"
import { strings } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import { MAIN_PADDING } from "../../consts"

class NewLesson extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			date: this.props.navigation.getParam("date"),
			hour: "",
			studentName: "",
			meetup: "",
			dropoff: "",
			topics: "",
			errors: {}
		}
	}

	onFocus = input => {
		this.setState({ [`${input}Color`]: "rgb(12,116,244)" })
	}

	onBlur = input => {
		this.setState({ [`${input}Color`]: undefined })
	}

	render() {
		return (
			<View style={{ flex: 1, marginTop: 20 }}>
				<View style={styles.headerRow}>
					<Button
						icon={<Icon name="arrow-forward" type="material" />}
						onPress={() => {
							this.props.navigation.goBack()
						}}
						type="clear"
					/>
					<PageTitle
						style={styles.title}
						title={strings("teacher.new_lesson.title")}
					/>
				</View>
				<KeyboardAvoidingView
					behavior="height"
					keyboardVerticalOffset={62}
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
							inputContainerStyle={styles.inputContainer}
							inputStyle={{
								...styles.input,
								...{ color: this.state["dateColor"] || "#000" }
							}}
							errorMessage={this.state.errors["date"]}
							textAlign={"right"}
							autoFocus={true}
							blurOnSubmit={false}
							onSubmitEditing={() => {
								this.hourInput.focus()
							}}
							leftIcon={
								<Icon
									name="date-range"
									type="material"
									size={24}
									color={this.state["dateColor"]}
								/>
							}
							onFocus={() => this.onFocus("date")}
							onBlur={() => this.onBlur("date")}
						/>
						<Input
							placeholder={strings("teacher.new_lesson.hour")}
							onChangeText={hour => this.setState({ hour })}
							value={this.state.hour}
							testID="hourInput"
							inputContainerStyle={styles.inputContainer}
							inputStyle={{
								...styles.input,
								...{ color: this.state["hourColor"] || "#000" }
							}}
							errorMessage={this.state.errors["hour"]}
							textAlign={"right"}
							ref={input => {
								this.hourInput = input
							}}
							onSubmitEditing={() => {
								this.studentInput.focus()
							}}
							leftIcon={
								<Icon
									name="access-time"
									type="material"
									size={24}
									color={this.state["hourColor"] || "#000"}
								/>
							}
							placeholderTextColor={
								this.state["hourColor"] || "lightgray"
							}
							onFocus={() => this.onFocus("hour")}
							onBlur={() => this.onBlur("hour")}
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
							inputContainerStyle={styles.inputContainer}
							inputStyle={{
								...styles.input,
								...{
									color: this.state["studentColor"] || "#000"
								}
							}}
							errorMessage={this.state.errors["studentName"]}
							textAlign={"right"}
							ref={input => {
								this.studentInput = input
							}}
							onSubmitEditing={() => {
								this.meetupInput.focus()
							}}
							leftIcon={
								<Icon
									name="person-outline"
									type="material"
									size={24}
									color={this.state["studentColor"] || "#000"}
								/>
							}
							placeholderTextColor={
								this.state["studentColor"] || "lightgray"
							}
							onFocus={() => this.onFocus("student")}
							onBlur={() => this.onBlur("student")}
						/>
						<Input
							placeholder={strings("teacher.new_lesson.meetup")}
							onChangeText={meetup => this.setState({ meetup })}
							value={this.state.meetup}
							testID="meetupInput"
							inputContainerStyle={styles.inputContainer}
							inputStyle={{
								...styles.input,
								...{
									color: this.state["meetupColor"] || "#000"
								}
							}}
							errorMessage={this.state.errors["meetup"]}
							textAlign={"right"}
							ref={input => {
								this.meetupInput = input
							}}
							onSubmitEditing={() => {
								this.dropoffInput.focus()
								this._scrollView.scrollToEnd()
							}}
							leftIcon={
								<Icon
									name="navigation"
									type="feather"
									size={24}
									color={this.state["meetupColor"] || "#000"}
								/>
							}
							placeholderTextColor={
								this.state["meetupColor"] || "lightgray"
							}
							onFocus={() => this.onFocus("meetup")}
							onBlur={() => this.onBlur("meetup")}
						/>
						<Input
							placeholder={strings("teacher.new_lesson.dropoff")}
							onChangeText={dropoff => this.setState({ dropoff })}
							value={this.state.dropoff}
							testID="dropoffInput"
							inputContainerStyle={styles.inputContainer}
							inputStyle={{
								...styles.input,
								...{
									color: this.state["dropoffColor"] || "#000"
								}
							}}
							errorMessage={this.state.errors["dropoff"]}
							textAlign={"right"}
							ref={input => {
								this.dropoffInput = input
							}}
							onSubmitEditing={() => {
								this.topicsInput.focus()
							}}
							leftIcon={
								<Icon
									name="map-pin"
									type="feather"
									size={24}
									color={this.state["dropoffColor"] || "#000"}
								/>
							}
							placeholderTextColor={
								this.state["dropoffColor"] || "lightgray"
							}
							onFocus={() => this.onFocus("dropoff")}
							onBlur={() => this.onBlur("dropoff")}
						/>
						<Input
							placeholder={strings("teacher.new_lesson.topics")}
							onChangeText={date => this.setState({ date })}
							value={this.state.topics}
							testID="dateInput"
							inputContainerStyle={styles.inputContainer}
							inputStyle={styles.input}
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
						underlayColor="#ffffff00"
						ref={touchable => (this._touchable = touchable)}
					>
						<View testID="finishButton" style={styles.submitButton}>
							<Text>{strings("teacher.new_lesson.done")}</Text>
						</View>
					</TouchableHighlight>
				</KeyboardAvoidingView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: -20
	},
	title: {
		marginLeft: 12,
		marginTop: 5
	},
	headerRow: {
		flexDirection: "row",
		flex: 1,
		maxHeight: 50,
		paddingLeft: MAIN_PADDING
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
	inputContainer: {
		borderBottomColor: "rgb(200,200,200)",
		borderBottomWidth: 1,
		paddingBottom: 8,
		marginTop: 24
	},
	input: {
		paddingLeft: 12
	}
})

export default connect()(NewLesson)
