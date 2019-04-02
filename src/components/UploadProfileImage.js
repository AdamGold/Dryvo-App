import React from "react"
import {
	View,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator
} from "react-native"
import { showImagePicker } from "../actions/utils"
import FastImage from "react-native-fast-image"

export default class UploadProfileImage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false
		}
	}
	uploadImage = () => {
		showImagePicker(async source => {
			this.setState({ loading: true })
			await this.props.upload(source)
			this.setState({
				loading: false
			})
		})
	}
	render() {
		let loadingImage, loadingOverlay
		if (this.state.loading) {
			loadingImage = <ActivityIndicator style={styles.imageLoading} />
			loadingOverlay = (
				<View
					style={{
						...styles.loadingStyle,
						height: this.props.style.height,
						borderRadius: this.props.style.borderRadius
					}}
				/>
			)
		}
		return (
			<TouchableOpacity onPress={this.uploadImage.bind(this)}>
				<FastImage
					style={this.props.style}
					source={{
						uri: this.props.image
					}}
				/>
				{loadingOverlay}
				{loadingImage}
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	imageLoading: { position: "absolute", alignSelf: "center", top: 12 },
	loadingStyle: {
		position: "absolute",
		backgroundColor: "rgba(0,0,0,0.7)",
		top: 0,
		bottom: 0,
		right: 0,
		left: 0
	}
})
