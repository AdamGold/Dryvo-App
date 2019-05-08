import React from "react"
import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	Alert,
	Switch
} from "react-native"
import { connect } from "react-redux"
import { strings, errors } from "../../i18n"
import { Icon } from "react-native-elements"
import PageTitle from "../../components/PageTitle"
import { MAIN_PADDING, DEFAULT_MESSAGE_TIME, fullButton } from "../../consts"
import { API_ERROR } from "../../reducers/consts"
import { fetchOrError } from "../../actions/utils"
import { popLatestError } from "../../actions/utils"
import SuccessModal from "../../components/SuccessModal"
import Analytics from "appcenter-analytics"
import { Dropdown } from "react-native-material-dropdown"

export class AddPaymentChooseAmount extends React.Component {
	constructor(props) {
		super(props)
		this.filterOptions = [
			{ value: "cash", label: strings("teacher.add_payment.cash") },
			{ value: "check", label: strings("teacher.add_payment.check") },
			{ value: "credit", label: strings("teacher.add_payment.credit") },
			{ value: "bank", label: strings("teacher.add_payment.bank") },
			{ value: "other", label: strings("teacher.add_payment.other") }
		]
		this.state = {
			student: this.props.navigation.getParam("student"),
			amount: "",
			crn: "",
			details: "",
			type: this.filterOptions[0]["value"],
			successVisible: false,
			receipt: false
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
		if (this.state.details == "") {
			await this.setState({
				details: strings("teacher.add_payment.default_details")
			})
		}
		if (this.state.amount == "") {
			Alert.alert(
				strings("errors.title"),
				strings("errors.payment_empty_fields")
			)
			return
		}
		const resp = await this.props.dispatch(
			fetchOrError("/teacher/add_payment", {
				method: "POST",
				body: JSON.stringify({
					amount: parseInt(this.state.amount),
					student_id: this.state.student.student_id,
					details: this.state.details,
					crn: this.state.crn,
					payment_type: this.state.type
				})
			})
		)
		if (resp) {
			if (this.state.receipt) {
				const paymentID = resp.json["data"]["id"]
				const respFromReceipt = await this.props.dispatch(
					fetchOrError(`/teacher/payments/${paymentID}/receipt`, {
						method: "GET"
					})
				)
				if (!respFromReceipt) return
			}
			Analytics.trackEvent("Payment added", {
				Category: "Payment",
				state: JSON.stringify(this.state)
			})
			this.setState({ successVisible: true })
		}
	}

	changeText = (name, val) => {
		this.setState({ [name]: val })
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
					style={styles.container}
					behavior={Platform.OS === "ios" ? "padding" : null}
				>
					<ScrollView
						keyboardDismissMode={
							Platform.OS === "ios" ? "interactive" : "on-drag"
						}
						keyboardShouldPersistTaps="handled"
						style={styles.container}
					>
						<View style={styles.amountContainer}>
							<TextInput
								placeholder="000"
								value={this.state.amount}
								onChangeText={val =>
									this.changeText("amount", val)
								}
								style={styles.amountInput}
								autoFocus={true}
								maxLength={5}
								keyboardType="number-pad"
							/>
						</View>
						<Dropdown
							containerStyle={styles.dropdown}
							value={this.state.type}
							data={this.filterOptions}
							onChangeText={(val, index, data) =>
								this.setState({ type: val })
							}
							dropdownMargins={{ min: 20, max: 40 }}
							dropdownOffset={{ top: 0, left: 0 }}
						/>
						<TextInput
							placeholder={strings(
								"teacher.add_payment.details_placeholder"
							)}
							value={this.state.details}
							onChangeText={val =>
								this.changeText("details", val)
							}
							style={styles.normalInput}
						/>
						<TextInput
							placeholder={strings(
								"teacher.add_payment.crn_placeholder"
							)}
							value={this.state.crn}
							onChangeText={val => this.changeText("crn", val)}
							style={styles.normalInput}
						/>
						<View style={styles.receipt}>
							<Text style={styles.receiptText}>
								{strings("teacher.add_payment.create_receipt")}
							</Text>
							<Switch
								style={styles.receiptButton}
								value={this.state.receipt}
								onValueChange={val => {
									this.setState({ receipt: val })
								}}
							/>
						</View>
					</ScrollView>
					<TouchableOpacity
						onPress={this.addPayment}
						style={styles.floatButton}
					>
						<Text style={styles.buttonText}>
							{strings("teacher.add_payment.add")}
						</Text>
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
		fontSize: 48,
		fontFamily: "Assistant-Light",
		textAlign: "right"
	},
	normalInput: {
		backgroundColor: "#f4f4f4",
		padding: 20,
		marginTop: 12,
		textAlign: "right"
	},
	dropdown: {
		width: "90%",
		marginTop: 20,
		alignSelf: "center"
	},
	amountContainer: {
		borderBottomWidth: 0,
		backgroundColor: "#f4f4f4",
		padding: 20
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 20
	},
	floatButton: {
		...fullButton
	},
	receipt: {
		padding: MAIN_PADDING,
		flexDirection: "row"
	},
	receiptText: {
		fontWeight: "bold",
		marginTop: 4
	},
	receiptButton: { marginLeft: "auto" }
})
