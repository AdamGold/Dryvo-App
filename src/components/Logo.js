import React from "react"
import { View, StyleSheet, Image, Text } from "react-native"

export default class Logo extends React.Component {
	constructor(props) {
		super(props)
		this.sizes = {
			small: {
				width: 100,
				height: 80,
				fontSize: 24
			},
			medium: {
				width: 140,
				height: 112,
				fontSize: 40
			},
			large: {
				width: 196,
				height: 156,
				fontSize: 64
			}
		}

		this.state = { ...this.sizes[this.props.size] }
	}
	render() {
		return (
			<View style={{ ...styles.column }}>
				<Image
					source={require("../../assets/images/logo.png")}
					style={{
						width: this.state.width,
						height: this.state.height,
						resizeMode: "contain"
					}}
				/>
				<Text style={{ ...styles.text, fontSize: this.state.fontSize }}>
					Dryvo
				</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	text: {
		fontFamily: "Montserrat-Bold",
		color: "#fff"
	},
	column: {
		flexDirection: "column",
		alignItems: "center"
	}
})
