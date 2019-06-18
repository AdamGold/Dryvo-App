import React from "react"
import {
	View,
	StyleSheet,
	Alert,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	Text
} from "react-native"
import { connect } from "react-redux"
import { strings, errors } from "../../i18n"
import { Button, Icon } from "react-native-elements"
import PageTitle from "../../components/PageTitle"
import { fetchOrError } from "../../actions/utils"
import AuthInput from "../../components/AuthInput"
import { MAIN_PADDING, DEFAULT_IMAGE, fullButton } from "../../consts"
import UploadProfileImage from "../../components/UploadProfileImage"
import SuccessModal from "../../components/SuccessModal"
import validate, { registerValidation } from "../../actions/validate"
import AlertError from "../../components/AlertError"

export class NewStudent extends AlertError {
	constructor(props) {
		super(props)
		this.state = {
			successVisible: false,
			image: ""
		}
		this.inputs = {
			email: {},
			name: {
				iconName: "person",
				placeholder: strings("signup.name")
			},
			phone: {
				iconName: "phone",
				placeholder: strings("signup.phone"),
				onChangeText: (name, value) => {
					this.setState({ [name]: value.replace(/[^0-9]/g, "") })
				}
			},
			price: {
				iconName: "payment",
				placeholder: strings("signup.price")
			}
		}
		Object.keys(this.inputs).forEach(input => {
			this.state[input] = ""
		})
	}

	_onChangeText = (name, input) => {
		this.setState({ [name]: input })
	}

	renderInputs = () => {
		return Object.keys(this.inputs).map((name, index) => {
			const props = this.inputs[name]
			return (
				<AuthInput
					key={`key${name}`}
					name={name}
					placeholder={props.placeholder || strings("signin." + name)}
					onChangeText={
						props.onChangeText || this._onChangeText.bind(this)
					}
					onFocus={props.onFocus}
					value={this.state[name]}
					testID={`r${name}Input`}
					iconName={props.iconName || name}
					validation={registerValidation}
					secureTextEntry={props.secureTextEntry || false}
				/>
			)
		})
	}

	submit = async () => {
		let error,
			flag = true
		for (let input of Object.keys(this.inputs)) {
			error = validate(input, this.state[input], registerValidation)
			if (error) {
				flag = false
				break
			}
		}

		if (!flag) {
			Alert.alert(error)
			return
		}
		var data = new FormData()
		const params = {
			email: this.state.email,
			name: this.state.name,
			phone: this.state.phone,
			image: this.state.image,
			price: parseInt(this.state.price)
		}
		Object.keys(params).forEach(key => data.append(key, params[key]))
		const requestParams = {
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data"
			},
			body: data
		}
		const resp = await this.props.dispatch(
			fetchOrError("/teacher/create_student", requestParams)
		)

		if (resp) {
			this.setState({ successVisible: true })
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<SuccessModal
					visible={this.state.successVisible}
					image="signup"
					title={strings("teacher.students.create_student_title")}
					desc={strings("teacher.students.create_student_desc", {
						name: this.state.name
					})}
					buttonPress={() => {
						this.setState({ successVisible: false })
						this.props.navigation.goBack()
					}}
					button={strings("teacher.students.success_button")}
				/>
				<View style={styles.headerRow}>
					<PageTitle
						style={styles.title}
						title={strings("teacher.students.add")}
						leftSide={
							<Button
								icon={
									<Icon
										name="ios-close"
										type="ionicon"
										size={36}
									/>
								}
								onPress={() => {
									this.props.navigation.goBack()
								}}
								type="clear"
							/>
						}
					/>
				</View>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : null}
					keyboardVerticalOffset={Platform.select({
						ios: fullButton.height,
						android: null
					})}
					style={styles.container}
				>
					<ScrollView
						keyboardDismissMode={
							Platform.OS === "ios" ? "interactive" : "on-drag"
						}
						keyboardShouldPersistTaps="handled"
						ref={r => (this.scrollView = r)}
						style={{ flex: 1 }}
						testID="StudentsSearchView"
					>
						<UploadProfileImage
							style={styles.profilePic}
							image={this.state.image.uri || DEFAULT_IMAGE}
							upload={async source => {
								this.setState({
									image: source
								})
							}}
						/>
						{this.renderInputs()}
					</ScrollView>
					<TouchableOpacity
						onPress={this.submit}
						style={styles.submitButton}
					>
						<Text style={styles.doneText}>
							{strings("teacher.new_lesson.done")}
						</Text>
					</TouchableOpacity>
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
		marginTop: 4
	},
	headerRow: {
		flex: 1,
		paddingLeft: MAIN_PADDING,
		paddingRight: MAIN_PADDING,
		maxHeight: 50
	},
	submitButton: { ...fullButton, position: "relative" },
	doneText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 20
	},
	profilePic: {
		width: 80,
		height: 80,
		borderRadius: 40,
		alignSelf: "center"
	}
})

function mapStateToProps(state) {
	return {
		error: state.error,
		fetchService: state.fetchService
	}
}

export default connect(mapStateToProps)(NewStudent)
