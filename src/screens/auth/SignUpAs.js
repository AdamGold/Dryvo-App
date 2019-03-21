import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { connect } from "react-redux"
import { Icon } from "react-native-elements"
import { floatButtonOnlyStyle, colors, MAIN_PADDING } from "../../consts"
import { strings } from "../../i18n"
import { NavigationActions } from "react-navigation"

export class SignUpAs extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selected: "student"
		}
	}
	_select = param => {
		this.setState({
			selected: param
		})
	}

	_forward = () => {
		this.props.navigation.navigate("Second", {
			role: this.state.selected
		})
	}
	render() {
		let studentSelected = {},
			teacherSelected = {},
			studentSelectedText = {},
			teacherSelectedText = {}
		const selected = {
			backgroundColor: colors.blue,
			shadowColor: colors.blue
		}
		const selectedText = {
			color: "#fff"
		}
		if (this.state.selected == "student") {
			studentSelected = selected
			studentSelectedText = selectedText
		} else {
			teacherSelected = selected
			teacherSelectedText = selectedText
		}
		return (
			<View style={styles.container}>
				<TouchableOpacity
					onPress={() => {
						this.props.navigation.dispatch(NavigationActions.back())
					}}
					style={styles.closeButton}
				>
					<Icon name="ios-close" type="ionicon" size={36} />
				</TouchableOpacity>
				<Text style={styles.title}>{strings("signup.sign_as")}</Text>
				<TouchableOpacity
					style={{ ...styles.button, ...studentSelected }}
					onPress={() => this._select("student")}
				>
					<View style={styles.row}>
						<Image
							source={require("../../../assets/images/student.png")}
							style={styles.image}
						/>
						<Text
							style={{
								...styles.buttonText,
								...studentSelectedText
							}}
						>
							{strings("signup.student")}
						</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={{ ...styles.button, ...teacherSelected }}
					onPress={() => this._select("teacher")}
				>
					<View style={styles.row}>
						<Image
							source={require("../../../assets/images/teacher.png")}
							style={{ ...styles.image, marginTop: 8 }}
						/>
						<Text
							style={{
								...styles.buttonText,
								...teacherSelectedText,
								marginTop: 20
							}}
						>
							{strings("signup.teacher")}
						</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.checkButton}
					onPress={this._forward.bind(this)}
				>
					<Icon name="check" type="material" size={60} color="#fff" />
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		paddingLeft: MAIN_PADDING,
		paddingRight: MAIN_PADDING
	},
	closeButton: {
		position: "absolute",
		top: 0,
		left: MAIN_PADDING,
		marginTop: 12
	},
	title: { fontSize: 40, marginTop: 100, fontWeight: "bold" },
	button: {
		...floatButtonOnlyStyle,
		borderRadius: 50,
		backgroundColor: "#fff",
		shadowColor: "rgba(0,0, 0, 0.2)",
		width: "100%",
		marginTop: 40,
		alignItems: "flex-start",
		height: 100,
		padding: 30
	},
	row: { flexDirection: "row" },
	image: {
		resizeMode: "contain",
		width: 60,
		height: 60,
		marginTop: -8
	},
	buttonText: {
		fontWeight: "bold",
		fontSize: 20,
		marginLeft: 24,
		marginTop: 12
	},
	checkButton: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: colors.blue,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		bottom: 40
	}
})

export default connect()(SignUpAs)
