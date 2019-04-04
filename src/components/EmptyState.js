import React from "react"
import { View, StyleSheet, Text } from "react-native"
import FastImage from "react-native-fast-image"
const images = {
	lessons: require("../../assets/images/lessons.png"),
	payments: require("../../assets/images/payments.png"),
	notifications: require("../../assets/images/notifications.png"),
	students: require("../../assets/images/students.png"),
	topics: require("../../assets/images/topics.png")
}
const sizes = {
	small: {
		width: 120,
		height: 80
	},
	big: {
		width: 200,
		height: 150
	}
}
export default class EmptyState extends React.Component {
	render() {
		return (
			<View style={{ ...styles.container, ...this.props.style }}>
				<FastImage
					style={{
						...styles.image,
						width: sizes[this.props.imageSize]["width"],
						height: sizes[this.props.imageSize]["height"]
					}}
					source={images[this.props.image]}
					resizeMode={FastImage.resizeMode.contain}
				/>
				<Text style={styles.text}>{this.props.text}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center"
	},
	image: {
		alignSelf: "center",
		...sizes.big
	},
	text: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#e1e1e1",
		marginTop: 20
	}
})
