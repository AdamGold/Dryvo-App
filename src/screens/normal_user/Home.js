import React from "react"
import { View, StyleSheet, TouchableOpacity, Alert, Text } from "react-native"
import { logout } from "../../actions/auth"
import { connect } from "react-redux"
import { strings, errors } from "../../i18n"
import SuccessModal from "../../components/SuccessModal"
import { signUpRoles, floatButtonOnlyStyle, MAIN_PADDING } from "../../consts"
import {
	deleteDeviceToken,
	popLatestError,
	fetchOrError
} from "../../actions/utils"
import ShadowRect from "../../components/ShadowRect"
import RectInput from "../../components/RectInput"
import validate, { registerValidation } from "../../actions/validate"
import { Icon } from "react-native-elements"
import { API_ERROR } from "../../reducers/consts"
import {
	getUserImage,
	uploadUserImage,
	getGreetingTime
} from "../../actions/utils"
import UploadProfileImage from "../../components/UploadProfileImage"

export class Home extends React.Component {
	static navigationOptions = () => {
		return {
			tabBarVisible: false
		}
	}

	constructor(props) {
		super(props)
		this.logout = this.logout.bind(this)
		this.role = "normal"
		let fillForm = false
		if (!this.props.user.area) {
			fillForm = true
		}
		this.state = {
			fillForm,
			name: "",
			phone: "",
			area: ""
		}
		if (this.props.user.hasOwnProperty("teacher_id")) {
			// it's a teacher
			this.role = signUpRoles.teacher
		} else if (this.props.user.hasOwnProperty("my_teacher")) {
			// it's a student
			this.role = signUpRoles.student
		}
	}

	componentDidUpdate() {
		const error = this.props.dispatch(popLatestError(API_ERROR))
		if (error) {
			Alert.alert(strings("errors.title"), errors(error))
		}
	}

	async logout() {
		await this.props.dispatch(deleteDeviceToken())
		this.props.dispatch(
			logout(async () => {
				this.props.navigation.navigate("Auth")
			})
		)
	}

	onChangeText = (param, value) => {
		this.setState({
			[param]: value
		})
	}

	submit = async () => {
		let error,
			flag = true
		for (let input of ["phone", "area", "name"]) {
			if (this.state[input] != "") {
				error = validate(input, this.state[input], registerValidation)
				if (error) {
					flag = false
					break
				}
			} else {
				error = strings("signin.invalid_field")
				flag = false
				break
			}
		}
		if (!flag) {
			Alert.alert(error)
			return
		}

		const resp = await this.props.dispatch(
			fetchOrError("/login/edit_data", {
				method: "POST",
				body: JSON.stringify({
					name: this.state.name,
					area: this.state.area,
					password: this.state.password,
					phone: this.state.phone
				})
			})
		)

		if (resp) {
			this.setState({ fillForm: false })
		}
	}

	render() {
		if (this.state.fillForm) {
			return (
				<View style={styles.formContainer}>
					<UploadProfileImage
						style={styles.profilePic}
						image={getUserImage(this.props.user)}
						upload={async source => {
							await this.props.dispatch(uploadUserImage(source))
						}}
					/>
					<Text style={styles.welcomeTitle}>
						{strings("welcome_from_facebook_title")}
					</Text>
					<Text style={styles.welcomeDesc}>
						{strings("welcome_from_facebook_desc")}
					</Text>
					<ShadowRect style={styles.rect}>
						<RectInput
							label={strings("signup.name")}
							iconName="person"
							value={this.state.name}
							onChangeText={value =>
								this.onChangeText("name", value)
							}
						/>
						<RectInput
							label={strings("signup.area")}
							iconName="person-pin"
							value={this.state.area}
							onChangeText={value =>
								this.onChangeText("area", value)
							}
						/>
						<RectInput
							label={strings("signup.phone")}
							iconName="phone"
							value={this.state.phone}
							onChangeText={value =>
								this.onChangeText("phone", value)
							}
						/>
						<TouchableOpacity
							style={styles.button}
							onPress={this.submit.bind(this)}
						>
							<View>
								<Text style={styles.buttonText}>
									{strings("settings.submit")}
								</Text>
							</View>
						</TouchableOpacity>
					</ShadowRect>
				</View>
			)
		}
		return (
			<View style={styles.container}>
				<SuccessModal
					animationType="none"
					visible={true}
					image="pending"
					title={strings("normal_user.home.pending")}
					desc={strings(
						"normal_user.home." + this.role + "_pending_desc"
					)}
					buttonPress={() => {
						this.logout()
					}}
					button={strings("settings.logout")}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center"
	},
	formContainer: {
		flex: 1,
		paddingLeft: MAIN_PADDING,
		paddingRight: MAIN_PADDING,
		marginTop: 20,
		alignItems: "center"
	},
	rect: {
		marginTop: 24,
		marginBottom: 24,
		paddingHorizontal: 0,
		paddingVertical: 0
	},
	buttonText: {
		fontWeight: "bold",
		fontSize: 20,
		color: "#fff"
	},
	button: { ...floatButtonOnlyStyle, width: "100%", borderRadius: 0 },
	welcomeTitle: { fontSize: 24, fontWeight: "bold" },
	welcomeDesc: { marginTop: 12, textAlign: "center", width: 240 },
	profilePic: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginBottom: 16
	}
})
const mapStateToProps = state => {
	return {
		user: state.user,
		errors: state.errors
	}
}

export default connect(mapStateToProps)(Home)
