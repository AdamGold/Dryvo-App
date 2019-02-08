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
				<Text style={{ flex: 1 }}>{this.props.name}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row"
	},
	pic: {
		width: 34,
		height: 34,
		borderRadius: 17
	}
})
