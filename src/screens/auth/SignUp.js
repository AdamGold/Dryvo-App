import React from "react"
import { View, Text, Button } from "react-native"
import { Input } from "react-native-elements"
import { connect } from "react-redux"
import { register } from "../../actions/auth"
import { API_ERROR, POP_ERROR } from "../../reducers/consts"
import { getLatestError } from "../../error_handling"
import { registerValidation } from "./validation"
import validate from "../../actions/validate"
import { strings } from "../../i18n"

export class SignUp extends React.Component {
	constructor(props) {
		super(props)
		this.register = this.register.bind(this)
		this.state = {
			email: "",
			name: "",
			area: "",
			password: "",
			errors: {
				api: "",
				emailError: "",
				nameError: "",
				areaError: "",
				passwordError: ""
			}
		}
	}

	componentDidUpdate() {
		const apiError = getLatestError(this.props.errors[API_ERROR])
		if (apiError) {
			this.setState({ errors: { api: apiError } })
			this.props.dispatch({ type: POP_ERROR, errorType: API_ERROR })
		}
	}

	async register() {
		await this.setState({
			errors: {
				api: "", // reset api error because we are sending new reqeuest
				emailError: validate(
					"email",
					this.state.email,
					registerValidation
				),
				nameError: validate(
					"name",
					this.state.name,
					registerValidation
				),
				areaError: validate(
					"area",
					this.state.area,
					registerValidation
				),
				passwordError: validate(
					"password",
					this.state.password,
					registerValidation
				)
			}
		})
		let flag = false // do we have an error?
		for (var i in this.state.errors) {
			if (this.state.errors[i]) {
				flag = true
				break
			}
		}
		if (flag) return

		await this.props.dispatch(
			register(this.state, () => {
				this.props.navigation.navigate("App")
			})
		)
	}
	render() {
		return (
			<View>
				<Text testID="rerror">{this.state.errors["api"]}</Text>
				<Input
					placeholder={strings("signin.email")}
					onChangeText={email => this.setState({ email })}
					onBlur={() => {
						const errors = { ...this.state.errors }
						errors.emailError = validate(
							"email",
							this.state.email,
							registerValidation
						)
						this.setState({
							errors
						})
					}}
					value={this.state.email}
					testID="remailInput"
					errorMessage={this.state.errors["emailError"]}
				/>
				<Input
					placeholder={strings("signup.name")}
					onChangeText={name => this.setState({ name })}
					onBlur={() => {
						const errors = { ...this.state.errors }
						errors.nameError = validate(
							"name",
							this.state.name,
							registerValidation
						)
						this.setState({
							errors
						})
					}}
					value={this.state.name}
					testID="rnameInput"
					errorMessage={this.state.errors["nameError"]}
				/>
				<Input
					placeholder={strings("signup.area")}
					onChangeText={area => this.setState({ area })}
					onBlur={() => {
						const errors = { ...this.state.errors }
						errors.areaError = validate(
							"area",
							this.state.area,
							registerValidation
						)
						this.setState({
							errors
						})
					}}
					value={this.state.area}
					testID="rareaInput"
					errorMessage={this.state.errors["areaError"]}
				/>
				<Input
					placeholder={strings("signin.password")}
					onChangeText={password => this.setState({ password })}
					onBlur={() => {
						const errors = { ...this.state.errors }
						errors.passwordError = validate(
							"password",
							this.state.password,
							registerValidation
						)
						this.setState({
							errors
						})
					}}
					value={this.state.password}
					secureTextEntry={true}
					testID="rpasswordInput"
					errorMessage={this.state.errors["passwordError"]}
				/>
				<Button
					title={strings("signup.signup_button")}
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
