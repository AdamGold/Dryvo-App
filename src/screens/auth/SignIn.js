import React from "react"
import { View, Button, Text } from "react-native"
import { deepLinkingListener } from "../../actions/utils"
import { connect } from "react-redux"
import { exchangeToken, openFacebook, directLogin } from "../../actions/auth"
import { Input } from "react-native-elements"
import { API_ERROR, POP_ERROR } from "../../reducers/consts"
import { getLatestError } from "../../error_handling"

export class SignIn extends React.Component {
	constructor(props) {
		super(props)
		this.login = this.login.bind(this)
		this.state = {
			email: "",
			password: "",
			error: ""
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
					error: ""
				})
			}
		)
		deepLinkingListener(this.handleOpenURL)
	}

	componentWillUnmount() {
		this.willFocusSubscription.remove()
	}

	componentDidUpdate() {
		const error = getLatestError(this.props.errors[API_ERROR])
		if (error) {
			this.setState({ error })
			this.props.dispatch({ type: POP_ERROR, errorType: API_ERROR })
		}
	}

	login() {
		this.props.dispatch(
			directLogin(this.state.email, this.state.password, () => {
				this.props.navigation.navigate("App")
			})
		)
	}

	render() {
		return (
			<View>
				<Text testID="error">{this.state.error}</Text>
				<Input
					placeholder="אימייל"
					onChangeText={email => this.setState({ email })}
					value={this.state.email}
					testID="emailInput"
				/>
				<Input
					placeholder="סיסמה"
					onChangeText={password => this.setState({ password })}
					value={this.state.password}
					secureTextEntry={true}
					testID="passwordInput"
				/>
				<Button
					testID="signInButton"
					title="התחבר"
					onPress={this.login}
				/>
				<Button
					title="הירשם"
					testID="signUpButton"
					onPress={() => {
						this.props.navigation.navigate("SignUp")
					}}
				/>
				<Button
					title="התחבר עם Facebook"
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
