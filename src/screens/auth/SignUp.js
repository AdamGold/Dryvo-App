import React from "react"
import { View, Text } from "react-native"
import { Input, Button } from "react-native-elements"
import { connect } from "react-redux"
import { register } from "../../actions/auth"
import { API_ERROR, POP_ERROR } from "../../reducers/consts"

class SignUp extends React.Component {
	constructor(props) {
		super(props)
		this.register = this.register.bind(this)
		this.state = {
			email: "",
			name: "",
			area: "",
			password: "",
			error: ""
		}
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

	register() {
		this.props.dispatch(
			register(this.state, () => {
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

const mapStateToProps = state => {
	return {
		errors: state.errors
	}
}

export default connect(mapStateToProps)(SignUp)
