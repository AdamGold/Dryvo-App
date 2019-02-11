import React from "react"
import { StyleSheet, View } from "react-native"

export default class LessonRow extends React.Component {
	render() {
		return (
			<View style={{ ...styles.lessonRow, ...this.props.style }}>
				{this.props.children}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	lessonRow: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center"
	}
})
