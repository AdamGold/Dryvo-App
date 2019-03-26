import React, { Fragment } from "react"
import { StyleSheet, View, Text } from "react-native"
import UserWithPic from "./UserWithPic"
import Row from "./Row"
import { strings } from "../i18n"
import Separator from "./Separator"

export default class Notification extends React.Component {
	render() {
		let children
		if (this.props.children) {
			children = <View style={styles.buttons}>{this.props.children}</View>
		}
		let row = (
			<UserWithPic
				name={this.props.name}
				extra={
					<Text>
						{strings("teacher.notifications." + this.props.type)}
					</Text>
				}
				width={54}
				height={54}
				style={styles.rightSide}
			/>
		)
		if (this.props.basic) {
			row = (
				<View style={styles.rightSide}>
					<Text style={this.props.basicStyle}>{this.props.date}</Text>
				</View>
			)
		}
		return (
			<Fragment>
				<Row style={this.props.style} leftSide={this.props.leftSide}>
					{row}
				</Row>
				{children}
				<Separator />
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
	rightSide: { marginTop: 4 },
	buttons: {
		flex: 1,
		marginTop: 20,
		flexDirection: "row",
		justifyContent: "space-between"
	}
})
