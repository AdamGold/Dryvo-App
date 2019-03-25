import React from "react"
import {
	View,
	ScrollView,
	Text,
	StyleSheet,
	TouchableOpacity,
	KeyboardAvoidingView
} from "react-native"
import {
	deepLinkingListener,
	deepLinkingRemoveListener
} from "../../actions/utils"
import { connect } from "react-redux"
import { exchangeToken, openFacebook, directLogin } from "../../actions/auth"
import { API_ERROR, POP_ERROR } from "../../reducers/consts"
import { getLatestError } from "../../error_handling"
import { strings } from "../../i18n"
import { colors, MAIN_PADDING, DEFAULT_MESSAGE_TIME } from "../../consts"
import Logo from "../../components/Logo"
import AuthInput from "../../components/AuthInput"
import LoadingButton from "../../components/LoadingButton"
import validate, { loginValidation } from "../../actions/validate"
import SlidingMessage from "../../components/SlidingMessage"

export class SignIn extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			error: "",
			slidingMessageVisible: false
		}
		this.inputs = {
			email: {},
			password: { secureTextEntry: true, iconName: "security" }
		}
		Object.keys(this.inputs).forEach(input => {
			this.state[input] = ""
			this.state[input + "Error"] = ""
		})
		this.handleOpenURL = this.handleOpenURL.bind(this)
		this.login = this.login.bind(this)
	}

	handleOpenURL = async event => {
		if (event.url) {
			let url = event.url.replace("#_=_", "")
			console.log(`Launched from deeplink ${url}`)
			url = new URLSearchParams(url).toString()
			let regex = /token=(.*)/
			const token = url.match(regex)[1]
			console.log(`New exchange token ${token}`)
			this.props.dispatch(
				exchangeToken(token, user => {
					this.props.navigation.navigate("App")
				})
			)
		}
	}

	async componentDidMount() {
		/* dismiss all errors on focus
		https://stackoverflow.com/questions/49458226/react-native-react-navigation-rerender-panel-on-goback
		*/
		this.willFocusSubscription = this.props.navigation.addListener(
			"willFocus",
			payload => {
				this.setState({
					error: ""
				})
			}
		)
		deepLinkingListener(this.handleOpenURL)
	}

	async componentWillUnmount() {
		this.willFocusSubscription.remove()
		await deepLinkingRemoveListener(this.handleOpenURL)
	}

	componentDidUpdate() {
		const error = getLatestError(this.props.errors[API_ERROR])
		if (error) {
			this.setState({ error, slidingMessageVisible: true })
			this.props.dispatch({ type: POP_ERROR, errorType: API_ERROR })
		}
	}

	async login() {
		let error,
			errors = []
		Object.keys(this.inputs).forEach(input => {
			error = validate(input, this.state[input], loginValidation)
			if (error) errors.push(error)
			this.setState({ [input + "Error"]: error })
		})

		if (errors.length > 0) return
		this.loginButton.showLoading(true)
		await this.props.dispatch(
			directLogin(this.state.email, this.state.password, user => {
				this.loginButton.showLoading(false)
				if (user) {
					this.setState(
						{ error: "", slidingMessageVisible: true },
						() => {
							setTimeout(
								() => this.props.navigation.navigate("App"),
								DEFAULT_MESSAGE_TIME
							)
						}
					)
				}
			})
		)
	}
	renderInputs = () => {
		return Object.keys(this.inputs).map((name, index) => {
			const props = this.inputs[name]
			return (
				<AuthInput
					key={`key${name}`}
					name={name}
					placeholder={strings("signin." + name)}
					onChangeText={input => this.setState({ [name]: input })}
					value={this.state[name]}
					testID={`${name}Input`}
					iconName={props.iconName || name}
					errorMessage={this.state[`${name}Error`]}
					validation={loginValidation}
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
					error={this.state.error}
					success={strings("signin.success")}
					close={() =>
						this.setState({ slidingMessageVisible: false })
					}
				/>
				<View style={styles.topLogo}>
					<Logo size="medium" />
				</View>
				<KeyboardAvoidingView behavior="padding">
					<ScrollView
						keyboardDismissMode="on-drag"
						keyboardShouldPersistTaps="always"
					>
						<View style={styles.formContainer}>
							{this.renderInputs()}
							<LoadingButton
								title={strings("signin.login_button")}
								onPress={this.login}
								ref={c => (this.loginButton = c)}
								style={styles.loginButton}
								textStyle={styles.loginText}
							/>
							<Text style={styles.or}>
								{strings("signin.or")}
							</Text>
							<LoadingButton
								title={strings("signin.facebook_login")}
								onPress={openFacebook}
								ref={c => (this.facebookButton = c)}
							/>
							<TouchableOpacity
								testID="signUpButton"
								onPress={() => {
									this.props.navigation.navigate("SignUp")
								}}
							>
								<View style={styles.signUpButton}>
									<Text style={styles.callToAction}>
										{strings("signin.not_yet_registered")}
									</Text>
									<Text style={styles.actionButton}>
										{" "}
										{strings("signin.signup_button")}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	error: {
		marginTop: 20,
		color: "red"
	},
	topLogo: {
		flex: 2,
		justifyContent: "center",
		backgroundColor: colors.blue,
		maxHeight: 240
	},
	formContainer: {
		flex: 3,
		paddingLeft: MAIN_PADDING,
		paddingRight: MAIN_PADDING,
		alignItems: "center"
	},
	loginButton: {
		backgroundColor: "#ececec",
		marginTop: 20
	},
	loginText: {
		color: "#9b9b9b"
	},
	or: {
		marginVertical: 16,
		fontWeight: "bold",
		fontSize: 20,
		color: "#c9c9c9"
	},
	callToAction: {
		color: "#9b9b9b"
	},
	signUpButton: {
		flexDirection: "row",
		marginTop: 20
	},
	actionButton: {
		color: colors.blue
	}
})

const mapStateToProps = state => {
	return {
		errors: state.errors
	}
}

export default connect(mapStateToProps)(SignIn)
