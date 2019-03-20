import React from "react"
import {
	TouchableOpacity,
	View,
	StyleSheet,
	TextInput,
	Text
} from "react-native"
import { Icon } from "react-native-elements"
import { colors } from "../consts"

export default class RectInput extends React.Component {
	constructor(props) {
		super(props)
		this.defaultColor = "#adadad"
		this.state = {
			color: this.defaultColor
		}
	}
	onPress = () => {
		this.input.focus()
	}
	onFocus = () => {
		this.setState({
			color: colors.blue
		})
		if (this.props.hasOwnProperty("onFocus")) this.props.onFocus()
	}
	onBlur = () => {
		this.setState({
			color: this.defaultColor
		})
		if (this.props.hasOwnProperty("onBlur")) this.props.onBlur()
	}
	render() {
		let iconType = "material"
		if (this.props.iconType) iconType = this.props.iconType
		return (
			<TouchableOpacity
				style={styles.inputView}
				onPress={this.onPress.bind(this)}
				activeOpacity={1}
			>
				<View style={styles.row}>
					<View style={styles.column}>
						<Text
							style={{
								...styles.inputLabel,
								color: this.state.color
							}}
						>
							{this.props.label}
						</Text>
						<TextInput
							style={styles.input}
							value={this.props.value}
							testID={this.props.testID}
							style={{
								...styles.input,
								...this.props.style
							}}
							autoFocus={this.props.autoFocus || false}
							ref={input => {
								this.input = input
							}}
							onSubmitEditing={this.props.onSubmitEditing}
							onFocus={this.onFocus.bind(this)}
							onBlur={this.onBlur.bind(this)}
						/>
					</View>
					<View style={styles.iconView}>
						<Icon
							type={iconType}
							name={this.props.iconName}
							color={this.state.color}
						/>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	inputView: {
		width: "100%",
		borderBottomWidth: 1,
		borderBottomColor: "#f7f7f7",
		paddingBottom: 6,
		alignItems: "flex-start",
		paddingHorizontal: 20,
		paddingVertical: 12
	},
	inputLabel: {
		color: "#adadad",
		fontWeight: "bold",
		fontSize: 14
	},
	column: {
		alignItems: "flex-start",
		flex: 1,
		flexDirection: "column"
	},
	input: {
		padding: 6,
		textAlign: "right"
	},
	iconView: {
		marginLeft: "auto",
		marginTop: 8
	},
	row: {
		flexDirection: "row"
	}
})
