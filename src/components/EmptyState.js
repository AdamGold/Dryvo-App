import React from "react"
import { View, Image, StyleSheet, Text } from "react-native"

export default class EmptyState extends React.Component {
	render() {
		const images = {
			lessons: require("../../assets/images/lessons.png"),
			payments: require("../../assets/images/payments.png"),
			notifications: require("../../assets/images/notifications.png"),
			students: require("../../assets/images/students.png"),
			topics: require("../../assets/images/topics.png")
		}
		return (
			<View style={{ ...styles.container, ...this.props.style }}>
				<Image style={styles.image} source={images[this.props.image]} />
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
		resizeMode: "contain",
		width: 200,
		height: 150
	},
	text: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#e1e1e1",
		marginTop: 20
	}
})
