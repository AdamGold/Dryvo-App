import React from "react"
import { View, Button, Linking, Text } from "react-native"
import {
	deepLinkingListener,
	deepLinkingRemoveListener
} from "../../actions/utils"
import { connect } from "react-redux"
import {
	exchangeToken,
	openFacebook,
	directLogin,
	setUser
} from "../../actions/auth"
import { Input } from "react-native-elements"
import { API_ERROR, POP_ERROR } from "../../reducers/consts"
import { loginValidation } from "./validation"
import validate from "../../actions/validate"
import { strings } from "../../i18n"
import { popLatestError } from "../../actions/utils"

export class SignIn extends React.Component {
	constructor(props) {
		super(props)
		this.login = this.login.bind(this)
		this.state = {
			email: "",
			password: "",
			error: "",
			emailError: "",
			passwordError: ""
		}
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
					error: "",
					passwordError: "",
					emailError: ""
				})
			}
		)
		let url = await Linking.getInitialURL()
		console.log("deep linked: " + url)
		await this.handleOpenURL({ url: url })
	}

	async componentWillUnmount() {
		this.willFocusSubscription.remove()
		await deepLinkingRemoveListener(this.handleOpenURL)
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

	async login() {
		const emailError = validate("email", this.state.email, loginValidation)
		const passwordError = validate(
			"password",
			this.state.password,
			loginValidation
		)

		this.setState({
			emailError: emailError,
			passwordError: passwordError
		})

		if (emailError || passwordError) return

		if (this.state.email == "t@t.com" && this.state.password == "testing") {
			this.props.dispatch(setUser({ name: "test", teacher_id: 1 }))
			this.props.navigation.navigate("App")
		} else {
			await this.props.dispatch(
				directLogin(this.state.email, this.state.password, () => {
					this.props.navigation.navigate("App")
				})
			)
		}
	}

	render() {
		return (
			<View>
				<Text>Mocked SignIn!</Text>
				<Text testID="error">{this.state.error}</Text>
				<Input
					placeholder={strings("signin.email")}
					onChangeText={email => this.setState({ email })}
					onBlur={() => {
						this.setState({
							emailError: validate(
								"email",
								this.state.email,
								loginValidation
							)
						})
					}}
					value={this.state.email}
					testID="emailInput"
					errorMessage={this.state.emailError}
				/>
				<Input
					placeholder={strings("signin.password")}
					onChangeText={password => this.setState({ password })}
					onBlur={() => {
						this.setState({
							passwordError: validate(
								"password",
								this.state.password,
								loginValidation
							)
						})
					}}
					value={this.state.password}
					secureTextEntry={true}
					testID="passwordInput"
					errorMessage={this.state.passwordError}
				/>
				<Button
					testID="signInButton"
					title={strings("signin.login_button")}
					onPress={this.login}
				/>
				<Button
					title={strings("signin.signup_button")}
					testID="signUpButton"
					onPress={() => {
						this.props.navigation.navigate("SignUp")
					}}
				/>
				<Button
					title={strings("signin.facebook_login")}
					testID="facebookLogin"
					onPress={() => {
						openFacebook()
					}}
				/>
			</View>
		)
	}
}

const mapStateToProps = state => {
	return {
		errors: state.errors
	}
}

export default connect(mapStateToProps)(SignIn)
