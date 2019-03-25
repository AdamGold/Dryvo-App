import React from "react"
import ContentLoader from "rn-content-loader"
import { Rect } from "react-native-svg"

export default class SimpleLoader extends React.Component {
	constructor(props) {
		super(props)
		this.width = props.width || 300
		this.height = props.height || 60
	}

	render() {
		const { props } = this

		return (
			<ContentLoader
				rtl
				height={this.height}
				width={this.width}
				speed={1}
				primaryColor="#f3f3f3"
				secondaryColor="#ecebeb"
				{...props}
			>
				<Rect
					x={this.width - 80}
					y="32"
					rx="4"
					ry="4"
					width="80"
					height="6.4"
				/>
				<Rect x="16" y="32" rx="4" ry="4" width="40.44" height="6.4" />
			</ContentLoader>
		)
	}
}
