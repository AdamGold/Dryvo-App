import React from "react"
import {
	Text,
	TouchableOpacity,
	Animated,
	ActivityIndicator,
	StyleSheet
} from "react-native"
import { colors } from "../consts"

const styles = StyleSheet.create({
	button: {
		borderRadius: 32,
		height: 64,
		backgroundColor: colors.blue,
		width: 100,
		alignItems: "center",
		justifyContent: "center"
	},
	buttonText: {
		fontSize: 20,
		color: "#fff"
	}
})

export default class LoadingButton extends React.Component {
	static defaultProps = {
		style: styles.button
	}
	constructor(props) {
		super(props)

		this.style = { ...LoadingButton.defaultProps.style, ...props.style }

		this.state = {
			loading: false
		}

		this.loadingValue = {
			width: new Animated.Value(this.style.width),
			borderRadius: new Animated.Value(this.style.borderRadius),
			opacity: new Animated.Value(1)
		}
	}

	showLoading(loading) {
		if (loading) {
			this._loadingAnimation(
				this.style.width,
				this.style.width / 4,
				this.style.borderRadius,
				this.style.height / 2,
				1,
				0
			)
			this.setState({ loading })
		} else {
			setTimeout(() => {
				this._loadingAnimation(
					this.style.width / 4,
					this.style.width,
					this.style.height / 2,
					this.style.borderRadius,
					0,
					1
				)
				this.setState({ loading })
			}, 1000)
		}
	}

	_loadingAnimation(
		widthStart,
		widthEnd,
		borderRadiusStart,
		borderRadiusEnd,
		opacityStart,
		opacityEnd
	) {
		if (this.loadingValue.width._value !== widthEnd) {
			this.loadingValue.width.setValue(widthStart)
			this.loadingValue.opacity.setValue(opacityStart)
			this.loadingValue.borderRadius.setValue(borderRadiusStart)

			Animated.timing(this.loadingValue.width, {
				toValue: widthEnd,
				duration: 400
			}).start()

			Animated.timing(this.loadingValue.borderRadius, {
				toValue: borderRadiusEnd,
				duration: 400
			}).start()

			Animated.timing(this.loadingValue.opacity, {
				toValue: opacityEnd,
				duration: 300
			}).start()
		}
	}
	_renderIndicator() {
		return <ActivityIndicator color={this.props.indicatorColor} />
	}

	_renderTitle() {
		return (
			<Text
				style={{
					...styles.buttonText,
					...this.props.textStyle
				}}
			>
				{this.props.title}
			</Text>
		)
	}

	render() {
		return (
			<TouchableOpacity
				testID={this.props.testID}
				onPress={!this.state.loading ? this.props.onPress : null}
				style={{ width: "100%", alignItems: "center" }}
			>
				<Animated.View
					style={{
						...styles.button,
						...this.style,
						...{
							width: this.loadingValue.width.interpolate({
								inputRange: [0, 100],
								outputRange: ["0%", "100%"]
							}),
							borderRadius: this.loadingValue.borderRadius
						}
					}}
				>
					{this.state.loading
						? this._renderIndicator()
						: this._renderTitle()}
				</Animated.View>
			</TouchableOpacity>
		)
	}
}
