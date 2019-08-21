import React from "react"
import { TouchableOpacity, View, TextInput } from "react-native"
import { Input } from "react-native-elements"

// fix for android inputs
// https://github.com/facebook/react-native/issues/12167
export default class TouchInput extends React.Component {
	constructor(props) {
		super(props)
	}
	input = null
	handleInputPress = () => {
		if (
			this.input &&
			(this.props.editable || this.props.editable == undefined)
		) {
			this.input.focus()
		}
	}

	assignNumberInputRef(input) {
		if (input) {
			this.input = input
			if (this.props.elem) this.props.elem(input)
		}
	}

	render() {
		let input = (
			<TextInput
				{...this.props}
				ref={input => this.assignNumberInputRef(input)}
			/>
		)
		if (this.props.type == "Input") {
			input = (
				<Input
					{...this.props}
					ref={input => this.assignNumberInputRef(input)}
				/>
			)
		}
		return (
			<TouchableOpacity
				activeOpacity={1}
				onPress={this.handleInputPress.bind(this)}
				style={{ width: "100%" }}
			>
				<View pointerEvents="none">{input}</View>
			</TouchableOpacity>
		)
	}
}
