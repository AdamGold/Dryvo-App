import React from "react"
import { Platform, Keyboard } from "react-native"
import { BottomTabBar } from "react-navigation-tabs"

export default class TabBar extends React.Component {
	state = {
		visible: true
	}

	componentDidMount() {
		if (Platform.OS === "android") {
			this.keyboardEventListeners = [
				Keyboard.addListener("keyboardDidShow", this.visible(false)),
				Keyboard.addListener("keyboardDidHide", this.visible(true))
			]
		}
	}

	componentWillUnmount() {
		this.keyboardEventListeners &&
			this.keyboardEventListeners.forEach(eventListener =>
				eventListener.remove()
			)
	}

	visible = visible => () => this.setState({ visible })

	render() {
		if (!this.state.visible) {
			return null
		} else {
			return <BottomTabBar {...this.props} />
		}
	}
}
