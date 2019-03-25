import React from "react"
import {
	View,
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView
} from "react-native"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import { Icon } from "react-native-elements"
import PageTitle from "../../components/PageTitle"
import {
	MAIN_PADDING,
	floatButtonOnlyStyle,
	DEFAULT_MESSAGE_TIME
} from "../../consts"
import { API_ERROR, POP_ERROR } from "../../reducers/consts"
import { NavigationActions } from "react-navigation"
import { getLatestError } from "../../error_handling"
import SlidingMessage from "../../components/SlidingMessage"
import { fetch } from "../../actions/utils"

export class AddPaymentChooseAmount extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			amount: "000",
			slidingMessageVisible: false
		}

		this.addPayment = this.addPayment.bind(this)
	}

	componentDidUpdate() {
		const error = getLatestError(this.props.errors[API_ERROR])
		if (error) {
			this.setState({ error, slidingMessageVisible: true })
			this.props.dispatch({ type: POP_ERROR, errorType: API_ERROR })
		}
	}

	addPayment = async () => {
		await this.props.dispatch(
			fetch("/teacher/add_payment", {
				method: "POST",
				body: JSON.stringify({
					amount: parseInt(this.state.amount),
					student_id: this.props.navigation.getParam("student")
						.student_id
				})
			})
		)
		if (this.props.errors.length == 0) {
			this.setState({ error: "", slidingMessageVisible: true }, () => {
				setTimeout(
					() =>
						this.props.navigation.dispatch(
							NavigationActions.back()
						),
					DEFAULT_MESSAGE_TIME
				)
			})
		}
	}

	changeAmount = amount => {
		this.setState({ amount })
	}

	render() {
		return (
			<View style={styles.container}>
				<SlidingMessage
					visible={this.state.slidingMessageVisible}
					error={this.state.error}
					success={strings("teacher.add_payment.success")}
					close={() =>
						this.setState({ slidingMessageVisible: false })
					}
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
				<View style={styles.amountContainer}>
					<TextInput
						placeholder="000.00"
						value={this.state.amount}
						onChangeText={amount => this.changeAmount(amount)}
						style={styles.amountInput}
						autoFocus={true}
						maxLength={5}
						keyboardType="number-pad"
					/>
				</View>
				<KeyboardAvoidingView
					behavior="padding"
					keyboardVerticalOffset={62}
					style={styles.container}
				>
					<TouchableHighlight
						underlayColor="#ffffff00"
						onPress={this.addPayment}
					>
						<View style={styles.floatButton}>
							<Text style={styles.buttonText}>
								{strings("done")}
							</Text>
						</View>
					</TouchableHighlight>
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
		...floatButtonOnlyStyle,
		alignSelf: "center",
		width: "80%",
		marginTop: 40
	}
})
