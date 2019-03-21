import React from "react"
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	TouchableOpacity,
	Image
} from "react-native"
import { connect } from "react-redux"
import { register } from "../../actions/auth"
import { API_ERROR, POP_ERROR } from "../../reducers/consts"
import { getLatestError } from "../../error_handling"
import validate, { registerValidation } from "../../actions/validate"
import { strings } from "../../i18n"
import AuthInput from "../../components/AuthInput"
import { MAIN_PADDING, colors } from "../../consts"
import { Icon } from "react-native-elements"

export class SignUp extends React.Component {
	constructor(props) {
		super(props)
		this.register = this.register.bind(this)
		this.role = this.props.navigation.getParam("role")
		this.state = {
			api_error: ""
		}
		this.inputs = {
			email: {},
			name: { iconName: "person", placeholder: strings("signup.name") },
			area: {
				iconName: "person-pin",
				placeholder: strings("signup.area")
			},
			password: { secureTextEntry: true, iconName: "security" }
		}
		Object.keys(this.inputs).forEach(input => {
			this.state = { ...this.state, [input]: "", [input + "Error"]: "" }
		})
	}

	componentDidUpdate() {
		const apiError = getLatestError(this.props.errors[API_ERROR])
		if (apiError) {
			this.setState({ api_error: apiError })
			this.props.dispatch({ type: POP_ERROR, errorType: API_ERROR })
		}
	}

	async register() {
		let error,
			errors = []
		Object.keys(this.inputs).forEach(input => {
			error = validate(input, this.state[input], registerValidation)
			if (error) errors.push(error)
			this.setState({ [input + "Error"]: error })
		})

		if (errors.length > 0) return

		await this.props.dispatch(
			register(this.state, () => {
				this.props.navigation.navigate("App")
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
					placeholder={props.placeholder || strings("signin." + name)}
					onChangeText={input => this.setState({ [name]: input })}
					value={this.state[name]}
					testID={`r${name}Input`}
					iconName={props.iconName || name}
					errorMessage={this.state[`${name}Error`]}
					validation={registerValidation}
					secureTextEntry={props.secureTextEntry || false}
				/>
			)
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity
					onPress={() => {
						this.props.navigation.goBack()
					}}
					style={styles.backButton}
				>
					<Icon name="arrow-forward" type="material" />
				</TouchableOpacity>
				<KeyboardAvoidingView behavior="padding" style={styles.form}>
					<ScrollView
						keyboardDismissMode="on-drag"
						keyboardShouldPersistTaps="always"
					>
						<Image
							source={require("../../../assets/images/register.png")}
							style={styles.bigImage}
						/>
						<Text testID="rerror">{this.state.api_error}</Text>
						{this.renderInputs()}
						<TouchableOpacity
							testID="facebookLogin"
							onPress={this.register}
							style={styles.button}
						>
							<Text style={styles.buttonText}>
								{strings("signup.signup_button")}
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
	},
	bigImage: {
		resizeMode: "contain",
		width: 160,
		height: 160,
		alignSelf: "center",
		marginTop: 40
	},
	backButton: {
		position: "absolute",
		top: 0,
		left: MAIN_PADDING,
		marginTop: 12
	},
	form: {
		flex: 1,
		marginTop: MAIN_PADDING
	},
	button: {
		borderRadius: 32,
		padding: 20,
		backgroundColor: colors.blue,
		width: "100%",
		marginTop: 20,
		alignItems: "center"
	},
	buttonText: {
		fontSize: 20,
		color: "#fff"
	}
})

const mapStateToProps = state => {
	return {
		errors: state.errors
	}
}

export default connect(mapStateToProps)(SignUp)
