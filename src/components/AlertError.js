import React from "react"
import { Alert } from "react-native"
import { strings, errors } from "../i18n"
import { getError } from "../actions/utils"

export default class AlertError extends React.Component {
	componentDidUpdate() {
		const error = this.props.dispatch(getError())
		console.log(error)
		if (error) {
			Alert.alert(strings("errors.title"), errors(error))
		}
	}

	render() {}
}
