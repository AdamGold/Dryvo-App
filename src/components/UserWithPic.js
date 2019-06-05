import React from "react"
import { View, Text, StyleSheet } from "react-native"
import UserPic from "./UserPic"
import { NAME_LENGTH } from "../consts"

export default class UserWithPic extends React.Component {
	render() {
		const name = this.props.name || this.props.user.name
		return (
			<View style={{ ...styles.container, ...this.props.style }}>
				<View style={this.props.imageContainerStyle}>
					<UserPic
						width={this.props.width}
						height={this.props.height}
						user={this.props.user}
						style={this.props.imageStyle}
					/>
				</View>
				<View style={styles.column}>
					<Text style={{ ...styles.name, ...this.props.nameStyle }}>
						{name.slice(0, NAME_LENGTH)}
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
