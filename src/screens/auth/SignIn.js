import React from "react"
import { View, Button } from "react-native"
import {
	deepLinkingListener,
	deepLinkingRemoveListener
} from "../../actions/utils"
import { connect } from "react-redux"
import { exchangeToken, openFacebook, directLogin } from "../../actions/auth"
import { Input } from "react-native-elements"

class SignIn extends React.Component {
	constructor(props) {
		super(props)
		this.login = this.login.bind(this)
		this.state = {
			email: "",
			password: ""
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
				exchangeToken(token, userOrError => {
					if (typeof userOrError === "object") {
						this.props.navigation.navigate("App")
					}
				})
			)
		}
	}

	async componentDidMount() {
		deepLinkingListener(this.handleOpenURL)
	}

	login() {
		this.props.dispatch(
			directLogin(this.state.email, this.state.password, userOrError => {
				if (typeof userOrError === "object") {
					this.props.navigation.navigate("App")
				} else {
					// error
				}
			})
		)
	}

	render() {
		return (
			<View>
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

export default connect()(SignIn)
