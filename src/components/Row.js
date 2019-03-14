import React from "react"
import { StyleSheet, View, Text } from "react-native"

export default class Row extends React.Component {
	render() {
		return (
			<View style={{ ...styles.row, ...this.props.style }}>
				<View style={styles.rightSide}>{this.props.children}</View>
				<View style={styles.leftSide}>{this.props.leftSide}</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		width: "100%"
	},
	rightSide: {},
	leftSide: { marginLeft: "auto" }
})
