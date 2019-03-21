import React, { Fragment } from "react"
import ContentLoader from "rn-content-loader"
import Svg, { Circle, Rect } from "react-native-svg"

const ListLoader = props => (
	<ContentLoader
		rtl
		height={140}
		width={300}
		speed={2}
		primaryColor="#f3f3f3"
		secondaryColor="#ecebeb"
		{...props}
	>
		<Rect x="103" y="29" rx="4" ry="4" width="117" height="6.4" />
		<Rect x="134" y="43" rx="3" ry="3" width="85" height="6.4" />
		<Rect x="12" y="36.4" rx="3" ry="3" width="70" height="6.4" />
		<Circle cx="260.5" cy="35.5" r="22.5" />
		<Circle cx="260.5" cy="96.5" r="22.5" />
		<Rect x="133" y="95" rx="3" ry="3" width="85" height="6.4" />
		<Rect x="102" y="82" rx="4" ry="4" width="117" height="6.4" />
		<Rect x="12" y="88.4" rx="3" ry="3" width="70" height="6.4" />
	</ContentLoader>
)

export default ListLoader
