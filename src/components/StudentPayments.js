import React, { Fragment } from "react"
import { StyleSheet, View, Text, FlatList } from "react-native"
import Separator from "./Separator"
import Row from "./Row"
import moment from "moment"
import { DATE_FORMAT } from "../consts"

export default class StudentPayment extends React.Component {
	renderPaymentItem = ({ item, index }) => {
		let firstItemStyles = {}
		if (index == 0) {
			firstItemStyles = { marginTop: 0 }
		}
		return (
			<Row
				style={{ ...styles.paymentRow, ...firstItemStyles }}
				leftSide={
					<Text style={styles.amountOfStudent}>{item.amount}₪</Text>
				}
			>
				<Text style={styles.dateOfPayment}>
					{moment.utc(item.created_at).format(DATE_FORMAT)}
				</Text>
			</Row>
		)
	}

	render() {
		return (
			<Fragment>
				<View style={styles.amountView}>
					<Text style={styles.amount}>{this.props.sum}₪</Text>
				</View>
				<Separator />
				<FlatList
					data={this.props.payments}
					renderItem={this.renderPaymentItem}
					keyExtractor={item => `item${item.id}`}
				/>
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
	amountView: {
		marginTop: 16,
		alignSelf: "center"
	},
	amount: {
		fontFamily: "Assistant-Light",
		fontSize: 44,
		color: "rgb(24, 199, 20)"
	},
	amountOfStudent: {
		color: "rgb(24, 199, 20)"
	},
	dateOfPayment: {
		fontWeight: "bold"
	},
	paymentRow: {
		marginTop: 12
	}
})
