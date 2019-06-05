import React from "react"
import { getUserImage } from "../actions/utils"
import FastImage from "react-native-fast-image"

export default class UserPic extends React.Component {
	render() {
		const width = this.props.width || 34
		const img = getUserImage(this.props.user)
		return (
			<FastImage
				style={{
					...this.props.style,
					...{
						borderRadius: width / 2,
						width: width,
						height: this.props.height || 34
					}
				}}
				source={{
					uri: img
				}}
			/>
		)
	}
}
