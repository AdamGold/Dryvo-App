import React from "react"
import { StyleSheet } from "react-native"
import { Input, Button, Icon } from "react-native-elements"
import { strings } from "../i18n"

export default class NewLessonInput extends React.Component {
	render() {
		const { name } = this.props
		let iconType = "material"
		if (this.props.iconType) iconType = this.props.iconType
		return (
			<Input
				placeholder={
					strings(`teacher.new_lesson.${name}`) +
					this.props.extraPlaceholder
				}
				onChangeText={value => this.props.onChangeText(name, value)}
				value={this.props.state[name]}
				testID={`${name}Input`}
				inputContainerStyle={{
					...styles.inputContainer,
					...this.props.style
				}}
				inputStyle={{
					...styles.input,
					...{
						color: this.props.state[`${name}Color`] || "#000"
					}
				}}
				textAlign={"right"}
				autoFocus={this.props.autoFocus || false}
				ref={input => {
					this.props.setRef(input, name)
				}}
				onSubmitEditing={() => {
					if (this.props.onSubmitEditing) {
						this.props.onSubmitEditing()
						return
					}
					if (!this.props.next) return
					this.props.next().focus()
				}}
				leftIcon={
					<Icon
						name={this.props.iconName}
						type={iconType}
						size={24}
						color={this.props.state[`${name}Color`] || "#000"}
					/>
				}
				placeholderTextColor={
					this.props.state[`${name}Color`] || "lightgray"
				}
				onFocus={() => this.props.onFocus(name)}
				onBlur={() => this.props.onBlur(name)}
				editable={this.props.editable}
				selectTextOnFocus={this.props.selectTextOnFocus}
			/>
		)
	}
}

const styles = StyleSheet.create({
	inputContainer: {
		borderBottomColor: "rgb(200,200,200)",
		borderBottomWidth: 1,
		paddingBottom: 8,
		marginTop: 24
	},
	input: {
		paddingLeft: 12
	}
})
