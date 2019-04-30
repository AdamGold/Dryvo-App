import React from "react"
import {
	StyleSheet,
	TouchableOpacity,
	Text,
	Linking,
	Alert,
	View
} from "react-native"
import { strings } from "../i18n"
import { colors } from "../consts"
import { fetchOrError } from "../actions/utils"

export default class ShowReceipt extends React.Component {
	constructor(props) {
		super(props)
		this.state = { pdf_link: "" }
	}

	_showReceipt = () => {
		Linking.openURL(this.props.item.pdf_link || this.state.pdf_link)
	}

	_createReceipt = async () => {
		const resp = await this.props.dispatch(
			fetchOrError(`/teacher/payments/${this.props.item.id}/receipt`, {
				method: "GET"
			})
		)
		if (resp) {
			this.setState({ pdf_link: resp.json["pdf_link"] }, () => {
				Alert.alert(
					strings("teacher.receipt_created_title"),
					strings("teacher.receipt_created_msg", {
						student: this.props.item.student.user.name
					}),
					[
						{
							text: strings("show_receipt_later")
						},
						{
							text: strings("show_receipt"),
							onPress: () => this._showReceipt(),
							style: "cancel"
						}
					],
					{ cancelable: false }
				)
			})
		}
	}

	render() {
		if (this.props.item.pdf_link || this.state.pdf_link) {
			return (
				<TouchableOpacity
					onPress={this._showReceipt.bind(this)}
					style={this.props.style}
				>
					<Text style={styles.receipt}>
						{strings("show_receipt")}
					</Text>
				</TouchableOpacity>
			)
		} else {
			if (this.props.user.hasOwnProperty("teacher_id")) {
				return (
					<TouchableOpacity
						onPress={this._createReceipt.bind(this)}
						style={this.props.style}
					>
						<Text style={styles.receipt}>
							{strings("teacher.create_receipt")}
						</Text>
					</TouchableOpacity>
				)
			}
		}
		return <View />
	}
}

const styles = StyleSheet.create({
	receipt: {
		color: colors.blue,
		fontWeight: "bold",
		alignSelf: "flex-start"
	}
})
