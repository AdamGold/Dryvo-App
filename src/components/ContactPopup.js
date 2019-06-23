import React from "react"
import {
	StyleSheet,
	View,
	Text,
	TouchableHighlight,
	Linking
} from "react-native"
import Modal from "react-native-modal"
import { strings } from "../i18n"

export default class ContactPopup extends React.Component {
	constructor(props) {
		super(props)
	}

	call = () => {
		Linking.openURL(`tel:${this.props.phone}`)
	}

	whatsapp = () => {
		const phone = this.props.phone.substring(1) // remove leading 0
		Linking.openURL(`http://api.whatsapp.com/send?phone=972${phone}`)
	}

	render() {
		return (
			<Modal
				isVisible={this.props.visible}
				onBackdropPress={() => this.props.onPress()}
				animationIn="pulse"
				animationOut="fadeOut"
			>
				<View style={styles.popup} testID={this.props.testID}>
					<TouchableHighlight
						underlayColor="#f8f8f8"
						style={styles.row}
						onPress={this.whatsapp}
					>
						<Text style={styles.title}>{strings("whatsapp")}</Text>
					</TouchableHighlight>
					<TouchableHighlight
						underlayColor="#f8f8f8"
						style={styles.row}
						onPress={this.call}
					>
						<Text style={styles.title}>
							{strings("call_phone")}
						</Text>
					</TouchableHighlight>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	popup: {
		flex: 1,
		maxHeight: 120,
		backgroundColor: "#fff",
		alignSelf: "center",
		width: 320,
		alignContent: "center",
		borderRadius: 4
	},
	row: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		height: 60
	},
	title: {
		fontSize: 18,
		fontWeight: "bold"
	}
})
