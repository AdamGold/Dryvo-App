import React from "react"
import { StyleSheet, View, Text } from "react-native"

export default class PageTitle extends React.Component {
	render() {
		return (
			<View style={styles.row}>
				<Text style={{ ...styles.title, ...this.props.style }}>
					{this.props.title}
				</Text>
				<View style={styles.leftSide}>{this.props.leftSide}</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center"
	},
	leftSide: {
		flex: 1,
		alignItems: "flex-end",
		marginLeft: "auto",
		marginTop: -5
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		alignSelf: "flex-start",
		marginBottom: 20
	}
})
