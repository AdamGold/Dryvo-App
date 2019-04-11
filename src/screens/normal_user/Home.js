import React from "react"
import { View, StyleSheet } from "react-native"
import { logout } from "../../actions/auth"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import SuccessModal from "../../components/SuccessModal"
import { signUpRoles } from "../../consts"
import { deleteDeviceToken } from "../../actions/utils"

export class Home extends React.Component {
	constructor(props) {
		super(props)
		this.logout = this.logout.bind(this)
		this.role = "normal"
		if (this.props.user.hasOwnProperty("teacher_id")) {
			// it's a teacher
			this.role = signUpRoles.teacher
		} else if (this.props.user.hasOwnProperty("my_teacher")) {
			// it's a student
			this.role = signUpRoles.student
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
	render() {
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
	}
})
const mapStateToProps = state => {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(Home)
