import React, { Fragment } from "react"
import { StyleSheet, View, Text, TouchableHighlight } from "react-native"
import { strings } from "../../i18n"

export default class NotificationButtons extends React.Component {
	render() {
		return (
			<Fragment>
				<TouchableHighlight testID="approve" style={styles.touchable}>
					<View
						style={{
							...styles.button,
							...{ backgroundColor: "rgb(12,116,244)" }
						}}
					>
						<Text style={styles.buttonText}>
							{strings("approve")}
						</Text>
					</View>
				</TouchableHighlight>
				<TouchableHighlight style={styles.touchable}>
					<View
						style={{
							...styles.button,
							...{ backgroundColor: "rgb(197,197,197)" }
						}}
					>
						<Text style={styles.buttonText}>{strings("edit")}</Text>
					</View>
				</TouchableHighlight>
				<TouchableHighlight style={styles.touchable}>
					<View
						style={{
							...styles.button,
							...{ backgroundColor: "rgb(240,8,48)" }
						}}
					>
						<Text style={styles.buttonText}>
							{strings("postpone")}
						</Text>
					</View>
				</TouchableHighlight>
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
	touchable: {
		flex: 0.33
	},
	button: {
		alignItems: "center",
		padding: 8,
		borderRadius: 3,
		backgroundColor: "#000"
	},
	buttonText: {
		fontSize: 14,
		color: "#fff",
		fontWeight: "bold"
	}
})
