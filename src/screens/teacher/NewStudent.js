import React from "react"
import {
	View,
	StyleSheet,
	FlatList,
	TouchableHighlight,
	Alert
} from "react-native"
import { connect } from "react-redux"
import { strings, errors } from "../../i18n"
import { Button, Icon } from "react-native-elements"
import PageTitle from "../../components/PageTitle"
import { MAIN_PADDING } from "../../consts"
import { API_ERROR } from "../../reducers/consts"
import { fetchOrError } from "../../actions/utils"
import AuthInput from "../../components/AuthInput"
import { MAIN_PADDING, DEFAULT_IMAGE, signUpRoles } from "../../consts"
import { popLatestError, checkFirebasePermission } from "../../actions/utils"
import UploadProfileImage from "../../components/UploadProfileImage"
import SuccessModal from "../../components/SuccessModal"

export class NewStudent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			successVisible: false,
			image: ""
		}
		this.inputs = {
			email: {
				onFocus: () => {
					this.scrollView.scrollTo({ y: -200 })
				}
			},
			name: {
				iconName: "person",
				placeholder: strings("signup.name")
			},
			phone: {
				iconName: "phone",
				placeholder: strings("signup.phone"),
				onChangeText: (name, value) => {
					this.setState({ [name]: value.replace(/[^0-9]/g, "") })
				},
				onFocus: () => {
					this.scrollView.scrollTo({ y: 50 })
				}
			}
		}
		Object.keys(this.inputs).forEach(input => {
			this.state[input] = ""
		})
	}

	componentDidUpdate() {
		const error = this.props.dispatch(popLatestError(API_ERROR))
		if (error) {
			Alert.alert(strings("errors.title"), errors(error))
		}
	}

	_onChangeText = (name, input) => {
		this.setState({ [name]: input })
	}

	renderInputs = () => {
		return Object.keys(this.inputs).map((name, index) => {
			const props = this.inputs[name]
			return (
				<AuthInput
					key={`key${name}`}
					name={name}
					placeholder={props.placeholder || strings("signin." + name)}
					onChangeText={
						props.onChangeText || this._onChangeText.bind(this)
					}
					onFocus={props.onFocus}
					value={this.state[name]}
					testID={`r${name}Input`}
					iconName={props.iconName || name}
					validation={registerValidation}
					secureTextEntry={props.secureTextEntry || false}
				/>
			)
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.headerRow}>
					<PageTitle
						style={styles.title}
						title={strings("teacher.students.add")}
						leftSide={
							<Button
								icon={
									<Icon
										name="ios-close"
										type="ionicon"
										size={36}
									/>
								}
								onPress={() => {
									this.props.navigation.goBack()
								}}
								type="clear"
							/>
						}
					/>
				</View>
				<View
					style={styles.studentsSearchView}
					testID="StudentsSearchView"
				>
					{this.renderInputs()}
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	title: {
		marginTop: 4
	},
	headerRow: {
		flex: 1,
		paddingLeft: MAIN_PADDING,
		paddingRight: MAIN_PADDING,
		maxHeight: 50
	}
})

function mapStateToProps(state) {
	return {
		errors: state.errors,
		fetchService: state.fetchService
	}
}

export default connect(mapStateToProps)(NewStudent)
