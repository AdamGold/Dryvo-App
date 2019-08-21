import React from "react"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { Input, Icon } from "react-native-elements"
import { colors } from "../consts"
import validate from "../actions/validate"
import TouchInput from "./TouchInput"

export default class AuthInput extends React.Component {
	constructor(props) {
		super(props)
		this.defaultColor = "#c9c9c9"
		this.state = {
			selectedColor: ""
		}
	}

	onFocus = () => {
		this.setState({
			selectedColor: colors.blue
		})

		if (this.props.onFocus) {
			this.props.onFocus()
		}
	}

	onBlur = () => {
		this.setState({
			selectedColor: ""
		})
	}

	render() {
		return (
			<TouchInput
				type={"Input"}
				keyboardType={this.props.keyboardType || "default"}
				placeholder={this.props.placeholder}
				onChangeText={value =>
					this.props.onChangeText(this.props.name, value)
				}
				onFocus={this.onFocus.bind(this)}
				onBlur={this.onBlur.bind(this)}
				value={this.props.value}
				secureTextEntry={this.props.secureTextEntry}
				testID={this.props.testID}
				errorMessage={this.state.error || this.props.errorMessage}
				inputContainerStyle={styles.inputContainer}
				inputStyle={styles.input}
				leftIcon={
					<View style={styles.inputIcon}>
						<Icon
							name={this.props.iconName}
							type="material"
							size={20}
							color={
								this.state.selectedColor || this.defaultColor
							}
						/>
					</View>
				}
			/>
		)
	}
}

const styles = StyleSheet.create({
	input: {
		padding: 16,
		textAlign: "right"
	},
	inputContainer: {
		borderWidth: 1,
		borderRadius: 28,
		borderColor: "#e0e0e0",
		marginTop: 12
	},
	inputIcon: {
		marginLeft: 6
	}
})
