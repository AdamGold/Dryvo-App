import React from "react"
import ContentLoader from "rn-content-loader"
import { Circle, Rect } from "react-native-svg"

class PaymentsLoader extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { props } = this

		return (
			<ContentLoader
				rtl
				height={220}
				width={300}
				speed={2}
				primaryColor="#f3f3f3"
				secondaryColor="#ecebeb"
				{...props}
			>
				<Rect x="90" y="16" rx="0" ry="0" width="120" height="49" />
				<Rect x="115" y="76" rx="0" ry="0" width="70" height="10" />
				<Rect x="17" y="110" rx="3" ry="3" width="40" height="6.4" />
				<Rect
					x="180.77"
					y="110"
					rx="4"
					ry="4"
					width="74.88"
					height="6.4"
				/>
				<Circle cx="280" cy="113.5" r="13" />
				<Circle cx="280" cy="175.6" r="13" />
				<Rect
					x="180.77"
					y="172"
					rx="4"
					ry="4"
					width="74.88"
					height="6.4"
				/>
				<Rect x="17" y="172" rx="3" ry="3" width="40" height="6.4" />
			</ContentLoader>
		)
	}
}

export default PaymentsLoader
