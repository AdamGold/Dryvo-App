import React from "react"
import { StyleSheet, View, Text } from "react-native"
import Modal from "react-native-modal"
import { errors } from "../i18n"

export default class SlidingMessage extends React.Component {
	render() {
		let color = "green"
		if (this.props.error) {
			color = "red"
		}
		return (
			<Modal
				isVisible={this.props.visible}
				animationIn="slideInDown"
				animationOut="slideOutUp"
				style={styles.modal}
				hasBackdrop={true}
				backdropOpacity={0}
				onBackdropPress={this.props.close}
				swipeThreshold={10}
				swipeDirection="up"
				onSwipeComplete={this.props.close}
			>
				<View
					style={{
						...styles.view,
						backgroundColor: color
					}}
				>
					<Text style={styles.text}>
						{this.props.error
							? errors(`errors.${this.props.error}`)
							: this.props.success}
					</Text>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	modal: {
		justifyContent: "flex-start",
		margin: 0
	},
	view: {
		height: 100,
		padding: 20,
		paddingTop: 60,
		alignItems: "flex-start"
	},
	text: {
		color: "#fff"
	}
})
