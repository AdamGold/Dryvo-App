import React from "react"
import { View, Text, Image, StyleSheet } from "react-native"

export default class UserWithPic extends React.Component {
	render() {
		const width = this.props.width || 34
		const img =
			"https://images.unsplash.com/photo-1535643302794-19c3804b874b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80"
		return (
			<View style={{ ...styles.container, ...this.props.style }}>
				<Image
					style={{
						borderRadius: width / 2,
						width: width,
						height: this.props.height || 34
					}}
					source={{
						uri: this.props.img || img
					}}
				/>
				<View style={styles.column}>
					<Text style={{ ...styles.name, ...this.props.nameStyle }}>
						{this.props.name}
					</Text>
					<Text>{this.props.extra}</Text>
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
