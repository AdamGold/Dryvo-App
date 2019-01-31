import React from "react"
import { View, Button, Text } from "react-native"
import {
	deepLinkingListener,
	deepLinkingRemoveListener
} from "../../actions/utils"
import { connect } from "react-redux"
import { exchangeToken, openFacebook, directLogin } from "../../actions/auth"
import { Input } from "react-native-elements"
import { API_ERROR, POP_ERROR } from "../../reducers/consts"

class SignIn extends React.Component {
	constructor(props) {
		super(props)
		this.login = this.login.bind(this)
		this.state = {
			email: "",
			password: "",
			error: ""
		}
	}
	componentWillUnmount() {
		deepLinkingRemoveListener(this.handleOpenURL)
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
		deepLinkingListener(this.handleOpenURL)
	}

	componentDidUpdate() {
		const apiErrors = this.props.errors[API_ERROR]
		if (apiErrors.length) {
			// we have errors
			this.setState({
				error: apiErrors[apiErrors.length - 1] // last error
			})
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
				<Text>{this.state.error}</Text>
				<Input
					placeholder="אימייל"
					onChangeText={email => this.setState({ email })}
					value={this.state.email}
				/>
				<Input
					placeholder="סיסמה"
					onChangeText={password => this.setState({ password })}
					value={this.state.password}
					secureTextEntry={true}
				/>
				<Button title="התחבר" onPress={this.login} />
				<Button
					title="הירשם"
					onPress={() => {
						this.props.navigation.navigate("SignUp")
					}}
				/>
				<Button
					title="התחבר עם Facebook"
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
