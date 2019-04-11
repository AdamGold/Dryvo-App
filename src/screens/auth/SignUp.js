import React, { Fragment } from "react"
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	TouchableOpacity,
	Platform,
	Keyboard,
	Alert
} from "react-native"
import { connect } from "react-redux"
import { register } from "../../actions/auth"
import { API_ERROR } from "../../reducers/consts"
import validate, { registerValidation } from "../../actions/validate"
import { strings, errors } from "../../i18n"
import AuthInput from "../../components/AuthInput"
import { MAIN_PADDING, DEFAULT_IMAGE, signUpRoles } from "../../consts"
import { Icon } from "react-native-elements"
import LoadingButton from "../../components/LoadingButton"
import { popLatestError } from "../../actions/utils"
import UploadProfileImage from "../../components/UploadProfileImage"
import SuccessModal from "../../components/SuccessModal"

export class SignUp extends React.Component {
	constructor(props) {
		super(props)
		this.register = this.register.bind(this)
		this.role = this.props.navigation.getParam("role")
		this.state = {
			successVisible: false,
			image: ""
		}
		this._initInputs()
	}

	_initInputs = () => {
		let extraInputs
		if (this.role == signUpRoles.teacher) {
			extraInputs = {
				duration: {
					iconName: "access-time",
					placeholder: strings("signup.duration")
				},
				price: {
					iconName: "payment",
					placeholder: strings("signup.price")
				}
			}
		} else {
			extraInputs = {
				teacher: {}
			}
		}
		this.inputs = {
			email: {},
			name: { iconName: "person", placeholder: strings("signup.name") },
			area: {
				iconName: "person-pin",
				placeholder: strings("signup.area")
			},
			phone: {
				iconName: "phone",
				placeholder: strings("signup.phone"),
				int: true
			},
			...extraInputs,
			password: { secureTextEntry: true, iconName: "security" }
		}
		Object.keys(this.inputs).forEach(input => {
			this.state[input] = ""
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
			Alert.alert(strings("errors.title"), errors(error))
		}
	}

	async register() {
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
		this.button.showLoading(true)

		await this.props.dispatch(
			register(
				{
					email: this.state.email,
					area: this.state.area,
					password: this.state.password,
					name: this.state.name,
					phone: this.state.phone,
					image: this.state.image,
					price: parseInt(this.state.price),
					duration: parseInt(this.state.duration)
				},
				user => {
					if (user) {
						this.setState({ successVisible: true })
					} else {
						this.button.showLoading(false)
					}
				},
				this.role
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
					onChangeText={input => {
						let v = input
						if (props.int) {
							v = v.replace(/[^0-9]/g, "")
						}
						this.setState({ [name]: v })
					}}
					value={this.state[name]}
					testID={`r${name}Input`}
					iconName={props.iconName || name}
					validation={registerValidation}
					secureTextEntry={props.secureTextEntry || false}
				/>
			)
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<SuccessModal
					visible={this.state.successVisible}
					image="signup"
					title={strings("signup.success_title")}
					desc={strings("signup." + this.role + "_success_desc")}
					buttonPress={() => {
						this.setState({ successVisible: false })
						this.props.navigation.navigate("App")
					}}
					button={strings("signup.success_button")}
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
										image: source
									})
								}}
							/>
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
		paddingBottom: 20
	}
})

const mapStateToProps = state => {
	return {
		errors: state.errors
	}
}

export default connect(mapStateToProps)(SignUp)
