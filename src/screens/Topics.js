import React from "react"
import { View, StyleSheet, FlatList, Text } from "react-native"
import { connect } from "react-redux"
import { strings } from "../i18n"
import PageTitle from "../components/PageTitle"
import { Button, Icon } from "react-native-elements"
import { MAIN_PADDING } from "../consts"
import ShadowRect from "../components/ShadowRect"
import TopicsList from "../components/TopicsList"

export class Topics extends React.Component {
	renderItem = item => {
		return null
	}
	render() {
		const topics = this.props.navigation.getParam("topics")
		return (
			<View style={styles.container}>
				<View style={styles.headerRow}>
					<Button
						icon={<Icon name="arrow-forward" type="material" />}
						onPress={() => {
							this.props.navigation.goBack()
						}}
						type="clear"
						style={{ marginTop: -6 }}
					/>
					<PageTitle
						style={styles.title}
						title={strings("teacher.new_lesson.topics")}
					/>
				</View>
				<ShadowRect style={styles.main}>
					<Text style={styles.rectTitle}>
						{strings("student_profile.in_progress_topics")}
					</Text>
					<TopicsList topics={topics["in_progress"]} />
				</ShadowRect>
				<ShadowRect style={styles.main}>
					<Text style={styles.rectTitle}>
						{strings("student_profile.finished_topics")}
					</Text>
					<TopicsList topics={topics["finished"]} />
				</ShadowRect>
				<ShadowRect style={styles.main}>
					<Text style={styles.rectTitle}>
						{strings("student_profile.new_topics")}
					</Text>
					<TopicsList topics={topics["new"]} />
				</ShadowRect>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: MAIN_PADDING,
		marginVertical: MAIN_PADDING
	},
	headerRow: {
		flexDirection: "row"
	},
	rectTitle: {
		fontWeight: "bold",
		color: "rgb(121, 121, 121)"
	},
	main: {
		marginTop: 12
	}
})

export default connect()(Topics)
