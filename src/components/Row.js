import React from "react"
import { StyleSheet, View } from "react-native"

export default class Row extends React.Component {
	render() {
		return (
			<View style={{ ...styles.row, ...this.props.style }}>
				{this.props.children}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	row: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center"
	}
})
