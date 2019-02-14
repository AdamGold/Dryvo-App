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
		flexDirection: "row"
	},
	leftSide: {
		flex: 0.7,
		marginLeft: "auto"
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		alignSelf: "flex-start",
		marginBottom: 20
	}
})
