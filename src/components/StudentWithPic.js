import React from "react"
import { View, Text, Image, StyleSheet } from "react-native"

export default class ShadowRect extends React.Component {
	render() {
		return (
			<View style={{ ...styles.container, ...this.props.style }}>
				<Image
					style={styles.pic}
					source={{
						uri:
							"https://images.unsplash.com/photo-1535643302794-19c3804b874b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80"
					}}
				/>
				<Text style={styles.name}>{this.props.name}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 0.5,
		flexDirection: "row"
	},
	name: {
		flex: 0.8,
		marginTop: 5,
		marginRight: 5,
		fontWeight: "bold"
	},
	pic: {
		width: 34,
		height: 34,
		borderRadius: 17
	}
})
