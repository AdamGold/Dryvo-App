import React from "react"
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableHighlight
} from "react-native"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import Row from "../../components/Row"
import UserWithPic from "../../components/UserWithPic"
import Separator from "../../components/Separator"
import { SearchBar, Button, Icon } from "react-native-elements"
import PageTitle from "../../components/PageTitle"
import { MAIN_PADDING, floatButton } from "../../consts"
import { API_ERROR } from "../../reducers/consts"
import { Input } from "react-native-elements"

export class AddPaymentAmount extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			amount: "0"
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
						student_id: this.state.student.student_id
					})
				}
			)
			this.props.navigation.goBack()
		} catch (error) {
			console.log(error)
			let msg = ""
			if (error && error.hasOwnProperty("message")) msg = error.message
			this.props.dispatch({ type: API_ERROR, error: msg })
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.headerRow}>
					<Button
						icon={<Icon name="arrow-forward" type="material" />}
						onPress={() => {
							this.props.navigation.goBack()
						}}
						type="clear"
					/>
					<PageTitle
						style={styles.title}
						title={strings("teacher.add_payment.title2")}
					/>
				</View>
				<View
					style={styles.studentsSearchView}
					testID="StudentsSearchView"
				>
					<Input
						value={this.state.amount}
						onChangeText={amount => this.setState({ amount })}
						placeholder={strings("teacher.add_payment.amount")}
						inputStyle={styles.amountInput}
						inputContainerStyle={{
							...styles.inputContainerStyle,
							...styles.amountContainer
						}}
					/>
				</View>
				<TouchableHighlight
					underlayColor="#ffffff00"
					onPress={this.addPayment}
				>
					<View style={styles.floatButton}>
						<Text style={styles.buttonText}>{strings("done")}</Text>
					</View>
				</TouchableHighlight>
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
		marginTop: 4
	},
	headerRow: {
		flexDirection: "row",
		flex: 1,
		maxHeight: 50,
		paddingLeft: MAIN_PADDING
	},
	amountInput: {
		alignItems: "flex-start"
	},
	amountContainer: {
		borderBottomWidth: 0,
		backgroundColor: "#f4f4f4"
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 20
	},
	floatButton: {
		...floatButton
	}
})
