import React from "react"
import { StyleSheet, View, Text } from "react-native"
import Modal from "react-native-modal"

export default class SlidingMessage extends React.Component {
	render() {
		return (
			<Modal
				isVisible={this.props.visible}
				animationIn="slideInDown"
				animationOut="slideOutUp"
				style={styles.modal}
				hasBackdrop={false}
				swipeDirection="up"
			>
				<View
					style={{
						...styles.view,
						backgroundColor: this.props.color
					}}
				>
					<Text style={styles.text}>{this.props.text}</Text>
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
