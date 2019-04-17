import React from "react"
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	Alert
} from "react-native"
import { connect } from "react-redux"
import { strings, errors } from "../../i18n"
import { Icon } from "react-native-elements"
import PageTitle from "../../components/PageTitle"
import { MAIN_PADDING, DEFAULT_MESSAGE_TIME, fullButton } from "../../consts"
import { API_ERROR } from "../../reducers/consts"
import { NavigationActions } from "react-navigation"
import { fetchOrError } from "../../actions/utils"
import { popLatestError } from "../../actions/utils"
import SuccessModal from "../../components/SuccessModal"
import Analytics from "appcenter-analytics"

export class AddPaymentChooseAmount extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			student: this.props.navigation.getParam("student"),
			amount: "",
			successVisible: false
		}

		this.addPayment = this.addPayment.bind(this)
	}

	componentDidUpdate() {
		const error = this.props.dispatch(popLatestError(API_ERROR))
		if (error) {
			Alert.alert(strings("errors.title"), errors(error))
		}
	}

	addPayment = async () => {
		const resp = await this.props.dispatch(
			fetchOrError("/teacher/add_payment", {
				method: "POST",
				body: JSON.stringify({
					amount: parseInt(this.state.amount),
					student_id: this.state.student.student_id
				})
			})
		)
		if (resp) {
			Analytics.trackEvent("Payment added", {
				Category: "Payment",
				state: JSON.stringify(this.state)
			})
			this.setState({ successVisible: true })
		}
	}

	changeAmount = amount => {
		this.setState({ amount })
	}

	render() {
		return (
			<View style={styles.container}>
				<SuccessModal
					visible={this.state.successVisible}
					image="payment"
					title={strings("teacher.add_payment.success_title")}
					desc={strings("teacher.add_payment.success_desc", {
						amount: this.state.amount,
						student: this.state.student.user.name
					})}
					buttonPress={() => {
						this.setState({ successVisible: false })
						this.props.navigation.navigate("Home")
					}}
					button={strings("teacher.add_payment.success_button")}
				/>
				<View style={styles.headerRow}>
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.goBack()
						}}
					>
						<Icon name="arrow-forward" type="material" />
					</TouchableOpacity>
					<PageTitle
						style={styles.title}
						title={strings("teacher.add_payment.title2")}
					/>
				</View>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "height" : "height"}
					keyboardVerticalOffset={Platform.select({
						ios: 40,
						android: 24
					})}
					style={styles.container}
				>
					<View style={styles.amountContainer}>
						<TextInput
							placeholder="000"
							value={this.state.amount}
							onChangeText={amount => this.changeAmount(amount)}
							style={styles.amountInput}
							autoFocus={true}
							maxLength={5}
							keyboardType="number-pad"
						/>
					</View>
					<TouchableOpacity
						onPress={this.addPayment}
						style={styles.floatButton}
					>
						<Text style={styles.buttonText}>{strings("done")}</Text>
					</TouchableOpacity>
				</KeyboardAvoidingView>
			</View>
		)
	}
}

function mapStateToProps(state) {
	return {
		fetchService: state.fetchService,
		errors: state.errors
	}
}
export default connect(mapStateToProps)(AddPaymentChooseAmount)

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	title: {
		marginLeft: 8,
		marginTop: -4
	},
	headerRow: {
		flexDirection: "row",
		padding: 0,
		justifyContent: "flex-start",
		marginLeft: MAIN_PADDING,
		marginRight: MAIN_PADDING,
		marginTop: 20
	},
	amountInput: {
		fontSize: 80,
		alignItems: "center",
		fontFamily: "Assistant-Light"
	},
	amountContainer: {
		borderBottomWidth: 0,
		backgroundColor: "#f4f4f4",
		padding: 20,
		marginTop: 80
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 20
	},
	floatButton: {
		...fullButton
	}
})
