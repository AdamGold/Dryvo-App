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
import { SearchBar, Button, Icon } from "react-native-elements"
import PageTitle from "../../components/PageTitle"
import { MAIN_PADDING, floatButtonOnlyStyle } from "../../consts"
import { API_ERROR } from "../../reducers/consts"
import { NavigationActions } from "react-navigation"

export class AddPaymentAmount extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			amount: "000.00"
		}

		this.addPayment = this.addPayment.bind(this)
	}

	addPayment = async () => {
		try {
			const resp = await this.props.fetchService.fetch(
				"/teacher/add_payment",
				{
					method: "POST",
					body: JSON.stringify({
						amount: this.state.amount,
						student_id: this.props.navigation.getParam("student")
							.student_id
					})
				}
			)
			this.props.navigation.dispatch(NavigationActions.back())
		} catch (error) {
			console.log(error)
			let msg = ""
			if (error && error.hasOwnProperty("message")) msg = error.message
			this.props.dispatch({ type: API_ERROR, error: msg })
		}
	}

	changeAmount = amount => {
		this.setState({ amount })
	}

	render() {
		return (
			<View style={styles.container}>
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
export default connect(mapStateToProps)(AddPaymentAmount)

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
