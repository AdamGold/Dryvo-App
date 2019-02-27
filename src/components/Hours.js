import React from "react"
import { Text } from "react-native"
import moment from "moment"

export default class Hours extends React.Component {
	render() {
		return (
			<Text style={this.props.style}>
				{moment(this.props.date).format("HH:mm")} -{" "}
				{moment(this.props.date)
					.add(this.props.duration, "minutes")
					.format("HH:mm")}
			</Text>
		)
	}
}
