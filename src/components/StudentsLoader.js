import React from "react"
import ContentLoader from "rn-content-loader"
import { Circle, Rect } from "react-native-svg"

export default class StudentsLoader extends React.Component {
	constructor(props) {
		super(props)
		this.height = props.height || 220
		this.width = props.width || 340
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
				<Circle cx={this.width - 24} cy="52" r="22.75" />
				<Rect
					x={this.width - 130}
					y="36"
					rx="4"
					ry="4"
					width="70"
					height="6.4"
				/>
				<Rect
					x={this.width - 100}
					y="50"
					rx="3"
					ry="3"
					width="40"
					height="6.4"
				/>

				<Rect
					x={this.width - 100}
					y="64"
					rx="3"
					ry="3"
					width="40"
					height="6.4"
				/>
				<Rect x="14.84" y="40" rx="0" ry="0" width="12" height="10" />
				<Circle cx={this.width - 24} cy="124" r="22.75" />
				<Rect
					x={this.width - 130}
					y="106"
					rx="4"
					ry="4"
					width="70"
					height="6.4"
				/>
				<Rect
					x={this.width - 100}
					y="120"
					rx="3"
					ry="3"
					width="40"
					height="6.4"
				/>

				<Rect
					x={this.width - 100}
					y="134"
					rx="3"
					ry="3"
					width="40"
					height="6.4"
				/>
				<Rect x="14.84" y="110" rx="0" ry="0" width="12" height="10" />
			</ContentLoader>
		)
	}
}
