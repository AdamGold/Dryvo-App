import React from "react"
import { StyleSheet, View, Text } from "react-native"

export default class PageTitle extends React.Component {
	render() {
		return (
			<Text style={{ ...styles.title, ...this.props.style }}>
				{this.props.title}
			</Text>
		)
	}
}

const styles = StyleSheet.create({
	title: {
		fontSize: 24,
		fontWeight: "bold",
		alignSelf: "flex-start",
		marginBottom: 20
	}
})
