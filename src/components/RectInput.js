import React from "react"
import {
	TouchableOpacity,
	View,
	StyleSheet,
	TextInput,
	Text,
	Switch
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
		if (this.input) this.input.focus()
		else if (this.props.hasOwnProperty("onPress")) {
			this.props.onPress()
		} else {
			// this is a switch, toggle it
			this.props.onChangeText(!this.props.value)
		}
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
		let input,
			leftSide,
			iconStyle,
			labelStyle = {}
		if (this.props.empty) {
			input = <View />
			leftSide = this.props.leftSide
			iconStyle = { marginBottom: 6 }
			labelStyle = { marginTop: 6 }
		} else if (!this.props.switch) {
			input = (
				<TextInput
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
					onChangeText={this.props.onChangeText}
					secureTextEntry={this.props.secureTextEntry || false}
				/>
			)
			leftSide = (
				<Icon
					type={iconType}
					name={this.props.iconName}
					color={this.state.color}
				/>
			)
			iconStyle = { marginTop: 8 }
		} else {
			input = <View />
			iconStyle = { marginBottom: 6 }
			leftSide = (
				<Switch
					value={this.props.value}
					onValueChange={this.props.onChangeText}
				/>
			)
			labelStyle = { marginTop: 6 }
		}
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
								...labelStyle,
								color: this.state.color
							}}
						>
							{this.props.label}
						</Text>
						{input}
					</View>
					<View style={{ ...styles.iconView, ...iconStyle }}>
						{leftSide}
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
		marginLeft: "auto"
	},
	row: {
		flexDirection: "row"
	}
})
