import React from "react"
import ContentLoader from "rn-content-loader"
import { Circle, Rect } from "react-native-svg"

class LessonsLoader extends React.Component {
	constructor(props) {
		super(props)
		this.width = props.width || 300
		this.height = props.height || 140
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
					x={this.width - 150}
					y="43"
					rx="3"
					ry="3"
					width="85"
					height="6.4"
				/>
				<Rect
					x={this.width - 182}
					y="29"
					rx="4"
					ry="4"
					width="117"
					height="6.4"
				/>
				<Rect x="12" y="36.4" rx="3" ry="3" width="70" height="6.4" />
				<Circle cx={this.width - 24} cy="35.5" r="22.5" />
				<Circle cx={this.width - 24} cy="96.5" r="22.5" />
				<Rect
					x={this.width - 150}
					y="95"
					rx="3"
					ry="3"
					width="85"
					height="6.4"
				/>
				<Rect
					x={this.width - 182}
					y="82"
					rx="4"
					ry="4"
					width="117"
					height="6.4"
				/>
				<Rect x="12" y="88.4" rx="3" ry="3" width="70" height="6.4" />
			</ContentLoader>
		)
	}
}

export default LessonsLoader
