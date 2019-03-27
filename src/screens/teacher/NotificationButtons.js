import React, { Fragment } from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { strings } from "../../i18n"
import { colors } from "../../consts"

export default class NotificationButtons extends React.Component {
	render() {
		let edit,
			size = 0.49
		if (this.props.edit) {
			size = 0.33
			edit = (
				<TouchableOpacity
					underlayColor="#ffffff00"
					style={{ flex: size }}
					onPress={this.props.edit}
				>
					<View
						style={{
							...styles.button,
							...{ backgroundColor: "rgb(197,197,197)" }
						}}
					>
						<Text style={styles.buttonText}>{strings("edit")}</Text>
					</View>
				</TouchableOpacity>
			)
		}
		return (
			<Fragment>
				<TouchableOpacity
					underlayColor="#ffffff00"
					testID="approve"
					style={{ flex: size }}
					onPress={this.props.approve}
				>
					<View
						style={{
							...styles.button,
							...{ backgroundColor: colors.blue }
						}}
					>
						<Text style={styles.buttonText}>
							{strings("approve")}
						</Text>
					</View>
				</TouchableOpacity>
				{edit}
				<TouchableOpacity
					underlayColor="#ffffff00"
					style={{ flex: size }}
					onPress={this.props.delete}
				>
					<View
						style={{
							...styles.button,
							...{ backgroundColor: "rgb(240,8,48)" }
						}}
					>
						<Text style={styles.buttonText}>
							{strings("reject")}
						</Text>
					</View>
				</TouchableOpacity>
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
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
