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
import UserWithPic from "../../components/UserWithPic"
import Separator from "../../components/Separator"
import { SearchBar, Button, Icon } from "react-native-elements"
import PageTitle from "../../components/PageTitle"

export class NewStudent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			search: ""
		}
	}
	updateSearch = search => {
		this.setState({ search })
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.headerRow}>
					<Button
						icon={<Icon name="arrow-forward" type="material" />}
						onPress={() => {
							this.props.navigation.goBack()
						}}
						type="clear"
					/>
					<PageTitle
						style={styles.title}
						title={strings("teacher.students.add")}
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
					/>
					<Separator />
					<FlatList
						data={[{ title: "Title Text", key: "item1" }]}
						renderItem={({ item }) => (
							<Row
								style={styles.row}
								leftSide={
									<Icon
										style={styles.arrow}
										name="ios-add"
										type="ionicon"
										color="#000"
									/>
								}
							>
								<UserWithPic
									name="רונן רוזנטל"
									extra={`${strings(
										"teacher.students.lesson_num"
									)}: 13`}
									nameStyle={styles.nameStyle}
									width={54}
									height={54}
									style={styles.userWithPic}
									imageContainerStyle={
										styles.imageContainerStyle
									}
								/>
							</Row>
						)}
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
		marginLeft: 12,
		marginTop: 4
	},
	headerRow: {
		flexDirection: "row",
		flex: 1,
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
	}
})

export default connect()(NewStudent)
