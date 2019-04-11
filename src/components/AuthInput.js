import React, { Fragment } from "react"
import { View, StyleSheet } from "react-native"
import { Input, Icon } from "react-native-elements"
import { colors } from "../consts"
import validate from "../actions/validate"

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
	}

	onBlur = () => {
		this.setState({
			selectedColor: ""
		})
	}
	render() {
		let below
		if (this.props.below)
			below = <View style={styles.belowStyle}>{this.props.below()}</View>
		return (
			<Fragment>
				<Input
					placeholder={this.props.placeholder}
					onChangeText={this.props.onChangeText}
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
									this.state.selectedColor ||
									this.defaultColor
								}
							/>
						</View>
					}
					ref={this.props.ref_}
				/>
				{below}
			</Fragment>
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
	},
	belowStyle: {
		marginTop: 12,
		flex: 1,
		flexWrap: "wrap",
		flexDirection: "row",
		justifyContent: "center"
	}
})
