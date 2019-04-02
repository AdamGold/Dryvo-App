import React from "react"
import { View, Text, Image, StyleSheet } from "react-native"
import { getUserImage } from "../actions/utils"

export default class UserWithPic extends React.Component {
	render() {
		const width = this.props.width || 34
		const img = getUserImage(this.props.user)
		let name = this.props.name || this.props.user.name
		return (
			<View style={{ ...styles.container, ...this.props.style }}>
				<View style={this.props.imageContainerStyle}>
					<Image
						style={{
							...this.props.imageStyle,
							...{
								borderRadius: width / 2,
								width: width,
								height: this.props.height || 34
							}
						}}
						source={{
							uri: img
						}}
					/>
				</View>
				<View style={styles.column}>
					<Text style={{ ...styles.name, ...this.props.nameStyle }}>
						{name}
					</Text>
					<View>{this.props.extra}</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row"
	},
	name: {
		fontWeight: "bold"
	},
	column: {
		flexDirection: "column",
		marginLeft: 16,
		alignItems: "flex-start"
	}
})
