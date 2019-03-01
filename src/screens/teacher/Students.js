import React from "react"
import {
	View,
	Text,
	TouchableHighlight,
	StyleSheet,
	FlatList
} from "react-native"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import Row from "../../components/Row"
import PageTitle from "../../components/PageTitle"
import UserWithPic from "../../components/UserWithPic"
import { Icon, SearchBar } from "react-native-elements"
import FlatButton from "../../components/FlatButton"
import { MAIN_PADDING } from "../../consts"

export class Students extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			search: "",
			students: [],
			page: 1,
			nextUrl: ""
		}
		this.updateSearch = this.updateSearch.bind(this)
		this._getStudents = this._getStudents.bind(this)
	}

	componentDidMount() {
		this.willFocusSubscription = this.props.navigation.addListener(
			"willFocus",
			payload => {
				this.setState(
					{
						students: []
					},
					() => {
						this._getStudents()
					}
				)
			}
		)
	}

	componentWillUnmount() {
		this.willFocusSubscription.remove()
	}

	_constructAPIUrl = (extra = "") => {
		if (extra) extra = "&" + extra
		return "/teacher/students?limit=10&page=" + this.state.page + extra
	}

	_getStudents = async () => {
		resp = await this.props.fetchService.fetch(this._constructAPIUrl(), {
			method: "GET"
		})
		this.setState({
			students: [...this.state.students, ...resp.json["data"]],
			nextUrl: resp.json["next_url"]
		})
	}

	updateSearch = search => {
		this.setState({ search }, async () => {
			resp = await this.props.fetchService.fetch(
				this._constructAPIUrl("name=" + search),
				{ method: "GET" }
			)
			this.setState({
				students: resp.json["data"]
			})
		})
	}
	renderItem = ({ item, index }) => {
		return (
			<Row
				key={`item${item.student_id}`}
				style={styles.row}
				leftSide={
					<Icon
						style={styles.arrow}
						name="ios-arrow-back"
						type="ionicon"
						color="#000"
					/>
				}
			>
				<UserWithPic
					name={item.user.name}
					extra={
						<Text>
							{strings("teacher.students.lesson_num")}:{" "}
							{item.new_lesson_number}
						</Text>
					}
					nameStyle={styles.nameStyle}
					width={54}
					height={54}
					style={styles.userWithPic}
					imageContainerStyle={styles.imageContainerStyle}
				/>
			</Row>
		)
	}

	endReached = () => {
		if (!this.state.nextUrl) return
		this.setState(
			{
				page: this.state.page + 1
			},
			() => {
				this._getStudents()
			}
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<View testID="StudentsView" style={styles.students}>
					<PageTitle
						style={styles.title}
						title={strings("tabs.students")}
						leftSide={
							<TouchableHighlight
								underlayColor="#ffffff00"
								onPress={() => {
									this.props.navigation.navigate("NewStudent")
								}}
							>
								<FlatButton
									testID="addStudentButton"
									title={strings("teacher.students.add")}
								/>
							</TouchableHighlight>
						}
					/>

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
						cancelButtonTitle={""}
					/>
					<FlatList
						data={this.state.students}
						renderItem={this.renderItem}
						onEndReached={this.endReached}
						keyExtractor={item => `item${item.student_id}`}
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
	students: {
		flex: 1,
		paddingRight: MAIN_PADDING,
		paddingLeft: MAIN_PADDING,
		marginTop: 20
	},
	title: { marginBottom: 0 },
	row: {
		marginTop: 24
	},
	nameStyle: {
		marginTop: 6
	},
	arrow: {
		flex: 1,
		marginRight: "auto"
	},
	userWithPic: { marginLeft: 10 },
	imageContainerStyle: {
		padding: 2,
		borderColor: "rgb(24,199,20)",
		borderWidth: 2,
		borderRadius: 37
	},
	searchBarContainer: {
		backgroundColor: "transparent",
		paddingBottom: 0,
		paddingTop: 0,
		marginTop: 20
	},
	inputContainerStyle: {
		borderRadius: 30,
		paddingLeft: 8,
		width: "100%",
		marginLeft: 0,
		marginRight: 0
	},
	search: {
		alignItems: "flex-start",
		paddingLeft: 6,
		fontSize: 14,
		marginLeft: 0
	}
})

function mapStateToProps(state) {
	return {
		fetchService: state.fetchService
	}
}

export default connect(mapStateToProps)(Students)
