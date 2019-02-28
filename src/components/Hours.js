import React from "react"
import { Text } from "react-native"
import moment from "moment"
import { getHoursDiff } from "../actions/utils"

export default class Hours extends React.Component {
	render() {
		const hours = getHoursDiff(this.props.date, this.props.duration)
		return (
			<Text style={this.props.style}>
				{hours["start"]} - {hours["end"]}
			</Text>
		)
	}
}
