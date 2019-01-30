import React from "react"
import { View } from "react-native"
import { Input, Button } from "react-native-elements"
import { connect } from "react-redux"
import { register } from "../../actions/auth"

class SignUp extends React.Component {
	constructor(props) {
		super(props)
		this.register = this.register.bind(this)
		this.state = {
			email: "",
			name: "",
			area: "",
			password: ""
		}
	}

	register() {
		try {
			this.props.dispatch(
				register(this.state, userOrError => {
					if (typeof userOrError === "object") {
						this.props.navigation.navigate("App")
					} else {
						// handle errors
					}
				})
			)
		} catch (error) {
			//handle errors
		}
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
					placeholder="שם מלא"
					onChangeText={name => this.setState({ name })}
					value={this.state.name}
				/>
				<Input
					placeholder="עיר מגורים"
					onChangeText={area => this.setState({ area })}
					value={this.state.area}
				/>
				<Input
					placeholder="סיסמה"
					onChangeText={password => this.setState({ password })}
					value={this.state.password}
					secureTextEntry={true}
				/>
				<Button title="הרשמה" onPress={this.register} />
			</View>
		)
	}
}

export default connect()(SignUp)
