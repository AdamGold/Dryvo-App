import React from "react"
import { View, Text, Button } from "react-native"
import { Input } from "react-native-elements"
import { connect } from "react-redux"
import { register } from "../../actions/auth"
import { API_ERROR, POP_ERROR } from "../../reducers/consts"
import { getLatestError } from "../../error_handling"

export class SignUp extends React.Component {
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
		const error = getLatestError(this.props.errors[API_ERROR])
		if (error) {
			this.setState({ error })
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
				<Text testID="rerror">{this.state.error}</Text>
				<Input
					placeholder="אימייל"
					onChangeText={email => this.setState({ email })}
					value={this.state.email}
					testID="remailInput"
				/>
				<Input
					placeholder="שם מלא"
					onChangeText={name => this.setState({ name })}
					value={this.state.name}
					testID="rnameInput"
				/>
				<Input
					placeholder="עיר מגורים"
					onChangeText={area => this.setState({ area })}
					value={this.state.area}
					testID="rareaInput"
				/>
				<Input
					placeholder="סיסמה"
					onChangeText={password => this.setState({ password })}
					value={this.state.password}
					secureTextEntry={true}
					testID="rpasswordInput"
				/>
				<Button
					title="הרשמה"
					testID="rsignUpButton"
					onPress={this.register}
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

export default connect(mapStateToProps)(SignUp)
