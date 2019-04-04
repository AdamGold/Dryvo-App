import React from "react"
import { StyleSheet, View, Text, Modal, TouchableOpacity } from "react-native"
import FastImage from "react-native-fast-image"
import { floatButtonOnlyStyle, MAIN_PADDING } from "../consts"
const images = {
	lesson: require("../../assets/images/lesson_success.png"),
	payment: require("../../assets/images/payment_success.png"),
	signup: require("../../assets/images/sign_up_success.png")
}
export default class SuccessModal extends React.Component {
	render() {
		return (
			<Modal
				animationType="slide"
				transparent={false}
				visible={this.props.visible}
				onRequestClose={() => {}}
			>
				<View style={styles.container}>
					<FastImage
						style={styles.img}
						source={images[this.props.image]}
						resizeMode={FastImage.resizeMode.contain}
					/>
					<Text style={styles.title}>{this.props.title}</Text>
					<Text style={styles.desc}>{this.props.desc}</Text>
					<TouchableOpacity
						style={styles.button}
						onPress={() => {
							this.setState({ visible: false }, () => {
								this.props.buttonPress()
							})
						}}
					>
						<Text style={styles.btnText}>{this.props.button}</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingLeft: MAIN_PADDING,
		paddingRight: MAIN_PADDING
	},
	img: {
		width: 120,
		height: 120
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginTop: 24
	},
	desc: {
		color: "gray",
		marginTop: 12,
		textAlign: "center"
	},
	button: {
		...floatButtonOnlyStyle,
		marginTop: 40
	},
	btnText: {
		color: "#fff"
	}
})
