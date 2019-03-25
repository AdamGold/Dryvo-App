import React from "react"
import { View } from "react-native"

class ContentLoader extends React.Component {
	render() {
		return <View>{this.props.children}</View>
	}
}
jest.mock("rn-content-loader", () => {
	return ContentLoader
})
