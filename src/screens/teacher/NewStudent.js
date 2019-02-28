import React from "react"
import {
	View,
	StyleSheet,
	FlatList,
	TouchableHighlight,
	ScrollView
} from "react-native"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import Row from "../../components/Row"
import UserWithPic from "../../components/UserWithPic"
import Separator from "../../components/Separator"
import { SearchBar, Button, Icon } from "react-native-elements"
import PageTitle from "../../components/PageTitle"
import { MAIN_PADDING } from "../../consts"
import { API_ERROR } from "../../reducers/consts"

export class NewStudent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			search: "",
			users: []
		}

		this._getUsers = this._getUsers.bind(this)
		this.assignUser = this.assignUser.bind(this)
	}

	updateSearch = search => {
		this.setState({ search }, () => {
			this._getUsers()
		})
	}

	assignUser = async user => {
		try {
			const resp = await this.props.fetchService.fetch(
				"/user/make_student?user_id=" + user.id,
				{ method: "GET" }
			)
			this.props.navigation.goBack()
		} catch (error) {
			console.log(error)
			let msg = ""
			if (error && error.hasOwnProperty("message")) msg = error.message
			this.props.dispatch({ type: API_ERROR, error: msg })
		}
	}
	_getUsers = async () => {
		const resp = await this.props.fetchService.fetch(
			"/user/search?name=" + this.state.search,
			{ method: "GET" }
		)
		this.setState({
			users: resp.json["data"]
		})
	}

	renderItem = ({ item, index }) => {
		return (
			<TouchableHighlight
				underlayColor="#f9f9f9"
				key={`user${item.id}`}
				onPress={() => {
					this.assignUser(item)
				}}
			>
				<Row
					leftSide={
						<Icon name="ios-add" type="ionicon" color="#000" />
					}
				>
					<UserWithPic
						name={item.name}
						nameStyle={styles.nameStyle}
						width={64}
						height={64}
					/>
				</Row>
			</TouchableHighlight>
		)
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
					<SearchBar
						placeholder={strings("teacher.students.search")}
						onChangeText={this.updateSearch}
						value={this.state.search}
						platform="ios"
						containerStyle={styles.searchBarContainer}
						inputContainerStyle={styles.inputContainerStyle}
						cancelButtonTitle={strings("teacher.students.cancel")}
						inputStyle={styles.search}
						textAlign="right"
						autoFocus={true}
						testID="searchBar"
					/>
					<Separator />
					<FlatList
						data={this.state.users}
						keyboardShouldPersistTaps="always"
						renderItem={this.renderItem}
						keyExtractor={item => `user${item.id}`}
					/>
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
	},
	studentsSearchView: { padding: 26, paddingTop: 0 },
	searchBarContainer: {
		backgroundColor: "transparent",
		paddingBottom: 0,
		paddingTop: 0
	},
	inputContainerStyle: {
		borderRadius: 30,
		paddingLeft: 8,
		paddingTop: 6,
		paddingBottom: 6,
		width: "100%",
		marginLeft: 0,
		marginRight: 0
	},
	search: {
		alignItems: "flex-start",
		paddingLeft: 6,
		fontSize: 14,
		marginLeft: 0
	},
	nameStyle: {
		fontSize: 18,
		marginTop: 14
	}
})

function mapStateToProps(state) {
	return {
		fetchService: state.fetchService
	}
}

export default connect(mapStateToProps)(NewStudent)
