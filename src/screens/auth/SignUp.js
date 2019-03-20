import React from "react"
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	TouchableOpacity
} from "react-native"
import { connect } from "react-redux"
import { register } from "../../actions/auth"
import { API_ERROR, POP_ERROR } from "../../reducers/consts"
import { getLatestError } from "../../error_handling"
import validate, { registerValidation } from "../../actions/validate"
import { strings } from "../../i18n"
import AuthInput from "../../components/AuthInput"
import { MAIN_PADDING } from "../../consts"

export class SignUp extends React.Component {
	constructor(props) {
		super(props)
		this.register = this.register.bind(this)
		this.state = {
			email: "",
			name: "",
			area: "",
			password: "",
			errors: {}
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
				email: validate("email", this.state.email, registerValidation),
				name: validate("name", this.state.name, registerValidation),
				area: validate("area", this.state.area, registerValidation),
				password: validate(
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
			<View style={styles.container}>
				<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
					<ScrollView
						keyboardDismissMode="on-drag"
						keyboardShouldPersistTaps="always"
					>
						<Text testID="rerror">{this.state.errors.api}</Text>
						<AuthInput
							name="email"
							placeholder={strings("signin.email")}
							onChangeText={email => this.setState({ email })}
							value={this.state.email}
							testID="remailInput"
							iconName="email"
							errorMessage={this.state.errors.email}
						/>
						<AuthInput
							name="name"
							placeholder={strings("signup.name")}
							onChangeText={name => this.setState({ name })}
							value={this.state.name}
							testID="rnameInput"
							iconName="person"
							errorMessage={this.state.errors.name}
						/>
						<AuthInput
							name="area"
							placeholder={strings("signup.area")}
							onChangeText={area => this.setState({ area })}
							value={this.state.area}
							testID="rareaInput"
							iconName="person-pin"
							errorMessage={this.state.errors.area}
						/>
						<AuthInput
							name="password"
							placeholder={strings("signin.password")}
							onChangeText={password =>
								this.setState({ password })
							}
							value={this.state.password}
							secureTextEntry={true}
							testID="rpasswordInput"
							iconName="security"
							errorMessage={this.state.errors.password}
						/>
						<TouchableOpacity
							testID="facebookLogin"
							onPress={this.register}
							style={styles.button}
						>
							<Text style={styles.buttonText}>
								{strings("signin.facebook_login")}
							</Text>
						</TouchableOpacity>
					</ScrollView>
				</KeyboardAvoidingView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: MAIN_PADDING,
		paddingRight: MAIN_PADDING
	}
})

const mapStateToProps = state => {
	return {
		errors: state.errors
	}
}

export default connect(mapStateToProps)(SignUp)
