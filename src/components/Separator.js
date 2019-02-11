import React from "react"
import { StyleSheet, View } from "react-native"

export default class Separator extends React.Component {
	render() {
		return <View style={styles.separator} />
	}
}

const styles = StyleSheet.create({
	separator: {
		width: "100%",
		borderBottomColor: "rgb(212, 212, 212)",
		borderBottomWidth: 1,
		marginTop: 20,
		marginBottom: 20
	}
})
