import React from "react"
import {
	KeyboardAvoidingView,
	Keyboard,
	Platform,
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
import NewLessonInput from "../../components/NewLessonInput"

class NewLesson extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			errors: {}
		}
		this.inputs = {
			date: {
				autoFocus: true,
				iconName: "date-range"
			},
			hour: {
				iconName: "access-time"
			},
			studentName: {
				iconName: "person-outline"
			},
			meetup: {
				iconName: "navigation",
				iconType: "feather",
				onSubmitEditing: () => {
					this.dropoffInput.focus()
					this._scrollView.scrollTo({ y: 50, animated: true })
				}
			},
			dropoff: {
				iconName: "map-pin",
				iconType: "feather",
				onSubmitEditing: () => {
					this._touchable.touchableHandlePress()
				}
			}
		}
		Object.keys(this.inputs).forEach(input => {
			if (input == "date") {
				this.state[input] = this.props.navigation.getParam("date")
			} else {
				this.state[input] = ""
			}
		})
		this.setRef = this.setRef.bind(this)
		this.onChangeText = this.onChangeText.bind(this)
	}

	onFocus = input => {
		this.setState({ [`${input}Color`]: "rgb(12,116,244)" })
	}

	onBlur = input => {
		this.setState({ [`${input}Color`]: undefined })
	}

	onChangeText = (name, value) => this.setState({ [name]: value })

	setRef = (input, name) => {
		this[`${name}Input`] = input
	}

	renderInputs = () => {
		const keys = Object.keys(this.inputs)
		return keys.map((name, index) => {
			const props = this.inputs[name]
			const next = keys[index + 1]
			return (
				<NewLessonInput
					key={`key${index}`}
					name={name}
					autoFocus={props.autoFocus}
					setRef={this.setRef}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChangeText={this.onChangeText}
					iconName={props.iconName}
					next={() => this[`${next}Input`]}
					state={this.state}
					iconType={props.iconType}
					onSubmitEditing={props.onSubmitEditing}
				/>
			)
		})
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
					behavior="padding"
					keyboardVerticalOffset={62}
					style={styles.container}
				>
					<ScrollView
						ref={ref => (this._scrollView = ref)}
						keyboardShouldPersistTaps="always"
						style={styles.formContainer}
					>
						<Text testID="error">{this.state.error}</Text>
						{this.renderInputs()}
					</ScrollView>
					<TouchableHighlight
						underlayColor="#ffffff00"
						ref={touchable => (this._touchable = touchable)}
					>
						<View testID="finishButton" style={styles.submitButton}>
							<Text style={styles.doneText}>
								{strings("teacher.new_lesson.done")}
							</Text>
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
	doneText: {
		color: "#fff",
		fontWeight: "bold"
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
