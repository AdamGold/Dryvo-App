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
import { MAIN_PADDING, DEFAULT_MESSAGE_TIME } from "../../consts"
import { Icon } from "react-native-elements"
import LoadingButton from "../../components/LoadingButton"
import SlidingMessage from "../../components/SlidingMessage"

export class SignUp extends React.Component {
	constructor(props) {
		super(props)
		this.register = this.register.bind(this)
		this.role = this.props.navigation.getParam("role")
		this.state = {
			api_error: "",
			success: false
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
			this.state[input] = ""
			this.state[input + "Error"] = ""
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
		this.button.showLoading(true)

		await this.props.dispatch(
			register(this.state, user => {
				this.button.showLoading(false)
				if (user) {
					this.setState({ success: true }, () => {
						setTimeout(
							() => this.props.navigation.navigate("App"),
							DEFAULT_MESSAGE_TIME
						)
					})
				}
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
		console.log(this.state.success)
		return (
			<View style={styles.container}>
				<SlidingMessage
					visible={this.state.success}
					color="green"
					text={strings("signup.success")}
				/>
				<TouchableOpacity
					onPress={() => {
						this.props.navigation.goBack()
					}}
					style={styles.backButton}
				>
					<Icon name="arrow-forward" type="material" />
				</TouchableOpacity>
				<ScrollView
					keyboardDismissMode="on-drag"
					keyboardShouldPersistTaps="always"
				>
					<KeyboardAvoidingView
						behavior="position"
						style={styles.form}
						keyboardVerticalOffset={100}
					>
						<Image
							source={require("../../../assets/images/register.png")}
							style={styles.bigImage}
						/>
						<Text style={styles.error} testID="rerror">
							{this.state.api_error
								? strings(`errors.${this.state.api_error}`)
								: ""}
						</Text>
						{this.renderInputs()}
						<LoadingButton
							title={strings("signup.signup_button")}
							onPress={this.register}
							ref={c => (this.button = c)}
							style={styles.button}
							indicatorColor="#fff"
						/>
					</KeyboardAvoidingView>
				</ScrollView>
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
		alignSelf: "center"
	},
	error: {
		marginTop: 12,
		color: "red",
		alignSelf: "flex-start"
	},
	backButton: {
		alignSelf: "flex-start",
		marginTop: 12
	},
	form: {
		flex: 1,
		marginTop: MAIN_PADDING
	},
	button: {
		marginTop: 20
	}
})

const mapStateToProps = state => {
	return {
		errors: state.errors
	}
}

export default connect(mapStateToProps)(SignUp)
