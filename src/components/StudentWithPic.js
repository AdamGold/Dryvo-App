import React from "react"
import { View, Text, Button, StyleSheet } from "react-native"

export default class ShadowRect extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<Text>{this.props.name}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})
