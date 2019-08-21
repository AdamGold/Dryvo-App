import React from "react"
import {
	View,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Alert,
	Text
} from "react-native"
import { logout } from "../../actions/auth"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import SuccessModal from "../../components/SuccessModal"
import { signUpRoles, floatButtonOnlyStyle, MAIN_PADDING } from "../../consts"
import { deleteDeviceToken, fetchOrError } from "../../actions/utils"
import ShadowRect from "../../components/ShadowRect"
import RectInput, { styles as rectStyles } from "../../components/RectInput"
import validate, { registerValidation } from "../../actions/validate"
import { getUserImage, uploadUserImage } from "../../actions/utils"
import UploadProfileImage from "../../components/UploadProfileImage"
import AlertError from "../../components/AlertError"
import InputSelectionButton from "../../components/InputSelectionButton"

export class Home extends AlertError {
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
			area: "",
			teachers: [],
			teacher_id: null
		}
		if (this.props.user.hasOwnProperty("teacher_id")) {
			// it's a teacher
			this.role = signUpRoles.teacher
		} else if (this.props.user.hasOwnProperty("my_teacher")) {
			// it's a student
			this.role = signUpRoles.student
		} else {
			// new user
			this._getTeachers()
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

	_getTeachers = async () => {
		const resp = await this.props.fetchService.fetch("/teacher/", {
			method: "GET"
		})
		this.setState({
			teachers: resp.json["data"]
		})
	}

	_onTeacherPress = teacher => {
		this.setState({
			teacher_id: teacher.teacher_id,
			teacher: teacher.user.name
		})
	}

	_renderTeachers = () => {
		return this.state.teachers.map((teacher, index) => {
			let style = {}
			if (index == 0) {
				style = { marginLeft: 0 }
			}
			let selected = false
			let selectedTextStyle
			if (this.state.teacher == teacher.user.name) {
				selected = true
				selectedTextStyle = { color: "#fff" }
			}
			return (
				<InputSelectionButton
					selected={selected}
					key={`teacher${index}`}
					onPress={() => this._onTeacherPress(teacher)}
					style={style}
				>
					<Text
						style={{
							...styles.hoursText,
							...selectedTextStyle
						}}
					>
						{teacher.user.name}
					</Text>
				</InputSelectionButton>
			)
		})
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
		const roleRequest = await this.props.dispatch(
			fetchOrError(
				"/user/make_student?teacher_id=" + this.state.teacher_id,
				{
					method: "GET"
				}
			)
		)

		if (resp && roleRequest) {
			this.setState({ fillForm: false })
		}
	}

	render() {
		if (this.state.fillForm) {
			return (
				<ScrollView>
					<View style={styles.formContainer}>
						<UploadProfileImage
							style={styles.profilePic}
							image={getUserImage(this.props.user)}
							upload={async source => {
								await this.props.dispatch(
									uploadUserImage(source)
								)
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
								keyboardType={"phone-pad"}
								label={strings("signup.phone")}
								iconName="phone"
								value={this.state.phone}
								onChangeText={value =>
									this.onChangeText("phone", value)
								}
							/>
							<View style={styles.teachers}>
								<Text style={styles.labelTitle}>
									{strings("signup.teacher")}
								</Text>
								<View style={styles.teachersList}>
									{this._renderTeachers()}
								</View>
							</View>
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
				</ScrollView>
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
	},
	teachers: rectStyles.inputView,
	labelTitle: {
		...rectStyles.inputLabel,
		alignSelf: "flex-start"
	},
	teachersList: {
		marginTop: 8,
		flexWrap: "wrap",
		flexDirection: "row",
		justifyContent: "flex-start"
	}
})
const mapStateToProps = state => {
	return {
		user: state.user,
		error: state.error,
		fetchService: state.fetchService
	}
}

export default connect(mapStateToProps)(Home)
