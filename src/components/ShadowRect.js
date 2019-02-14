import React from "react"
import { View, StyleSheet } from "react-native"
import { MAIN_PADDING } from "../consts"

export default class ShadowRect extends React.Component {
	render() {
		return (
			<View
				testID={this.props.testID}
				style={{ ...this.props.style, ...styles.container }}
			>
				{this.props.children}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 6
		},
		shadowOpacity: 0.09,
		shadowRadius: 20,
		elevation: 6,
		marginLeft: MAIN_PADDING,
		marginRight: MAIN_PADDING,
		borderRadius: 4,
		padding: 20
	}
})
