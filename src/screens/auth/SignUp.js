import React, { Fragment } from "react"
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	TouchableOpacity,
	Platform,
	Keyboard
} from "react-native"
import { connect } from "react-redux"
import { register } from "../../actions/auth"
import { API_ERROR, POP_ERROR } from "../../reducers/consts"
import validate, { registerValidation } from "../../actions/validate"
import { strings } from "../../i18n"
import AuthInput from "../../components/AuthInput"
import { MAIN_PADDING, DEFAULT_MESSAGE_TIME, DEFAULT_IMAGE } from "../../consts"
import { Icon } from "react-native-elements"
import LoadingButton from "../../components/LoadingButton"
import SlidingMessage from "../../components/SlidingMessage"
import { popLatestError } from "../../actions/utils"
import UploadProfileImage from "../../components/UploadProfileImage"

export class SignUp extends React.Component {
	constructor(props) {
		super(props)
		this.register = this.register.bind(this)
		this.role = this.props.navigation.getParam("role")
		this.state = {
			api_error: "",
			slidingMessageVisible: false,
			imageError: "",
			image: ""
		}
		this.inputs = {
			email: {},
			name: { iconName: "person", placeholder: strings("signup.name") },
			area: {
				iconName: "person-pin",
				placeholder: strings("signup.area")
			},
			password: { secureTextEntry: true, iconName: "security" }
		}
		Object.keys(this.inputs).forEach(input => {
			this.state[input] = ""
			this.state[input + "Error"] = ""
		})
	}
	componentDidMount() {
		if (Platform.OS === "android") {
			this.keyboardEventListeners = [
				Keyboard.addListener(
					"keyboardDidShow",
					this._handleKeyboardShow
				),
				Keyboard.addListener(
					"keyboardDidHide",
					this._handleKeyboardHide
				)
			]
		}
	}

	componentWillUnmount() {
		this.keyboardEventListeners &&
			this.keyboardEventListeners.forEach(eventListener =>
				eventListener.remove()
			)
	}

	_handleKeyboardHide = () => {
		this.scrollView.scrollTo({ y: 0 })
	}

	_handleKeyboardShow = () => {
		this.scrollView.scrollToEnd()
	}

	componentDidUpdate() {
		const error = this.props.dispatch(popLatestError(API_ERROR))
		if (error) {
			this.setState({
				error,
				slidingMessageVisible: true
			})
		}
	}

	async register() {
		let error,
			errors = []
		Object.keys(this.inputs).forEach(input => {
			error = validate(input, this.state[input], registerValidation)
			if (error) errors.push(error)
			this.setState({ [input + "Error"]: error })
		})
		if (this.state.image == "") {
			this.setState({ imageError: strings("signup.image_required") })
			return
		}

		if (errors.length > 0) return
		this.button.showLoading(true)

		await this.props.dispatch(
			register(
				{
					email: this.state.email,
					area: this.state.area,
					password: this.state.password,
					name: this.state.name,
					image: this.state.image
				},
				user => {
					this.button.showLoading(false)
					if (user) {
						this.setState(
							{ api_error: "", slidingMessageVisible: true },
							() => {
								setTimeout(
									() => this.props.navigation.navigate("App"),
									DEFAULT_MESSAGE_TIME
								)
							}
						)
					}
				}
			)
		)
	}

	renderInputs = () => {
		return Object.keys(this.inputs).map((name, index) => {
			const props = this.inputs[name]
			return (
				<AuthInput
					key={`key${name}`}
					name={name}
					placeholder={props.placeholder || strings("signin." + name)}
					onChangeText={input => this.setState({ [name]: input })}
					value={this.state[name]}
					testID={`r${name}Input`}
					iconName={props.iconName || name}
					errorMessage={this.state[`${name}Error`]}
					validation={registerValidation}
					secureTextEntry={props.secureTextEntry || false}
				/>
			)
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<SlidingMessage
					visible={this.state.slidingMessageVisible}
					error={this.state.api_error}
					success={strings("signup.success")}
					close={() =>
						this.setState({ slidingMessageVisible: false })
					}
				/>
				<TouchableOpacity
					onPress={() => {
						this.props.navigation.goBack()
					}}
					style={styles.backButton}
				>
					<Icon name="arrow-forward" type="material" />
				</TouchableOpacity>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "position" : null}
				>
					<ScrollView
						keyboardDismissMode={
							Platform.OS === "ios" ? "interactive" : "on-drag"
						}
						keyboardShouldPersistTaps="handled"
						ref={r => (this.scrollView = r)}
					>
						<View style={styles.formContainer}>
							<UploadProfileImage
								style={styles.profilePic}
								image={this.state.image.uri || DEFAULT_IMAGE}
								upload={async source => {
									this.setState({
										image: source,
										imageError: ""
									})
								}}
							/>
							<Text style={styles.error}>
								{this.state.imageError}
							</Text>
							{this.renderInputs()}
							<LoadingButton
								title={strings("signup.signup_button")}
								onPress={this.register}
								ref={c => (this.button = c)}
								style={styles.button}
								indicatorColor="#fff"
							/>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	error: {
		marginTop: 12,
		color: "red",
		fontSize: 12
	},
	backButton: {
		alignSelf: "flex-start",
		marginTop: 12,
		marginLeft: MAIN_PADDING
	},
	form: {
		flex: 1,
		marginTop: MAIN_PADDING
	},
	button: {
		marginTop: 20
	},
	profilePic: {
		width: 80,
		height: 80,
		borderRadius: 40,
		alignSelf: "center"
	},
	container: {
		flex: 1
	},
	formContainer: {
		flex: 1,
		paddingLeft: MAIN_PADDING,
		paddingRight: MAIN_PADDING,
		alignItems: "center",
		paddingBottom: 40
	}
})

const mapStateToProps = state => {
	return {
		errors: state.errors
	}
}

export default connect(mapStateToProps)(SignUp)
