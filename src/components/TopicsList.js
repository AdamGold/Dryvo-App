import React, { Fragment } from "react"
import { StyleSheet, View, Text, FlatList } from "react-native"
import EmptyState from "./EmptyState"
import { strings } from "../i18n"

export default class TopicsList extends React.Component {
	constructor(props) {
		super(props)
	}
	renderTopic = ({ item, index }) => {
		return (
			<View style={styles.topic} key={`topic${item.id}`}>
				<Text style={styles.topicText}>{item.title}</Text>
			</View>
		)
	}

	_renderEmpty = () => (
		<EmptyState
			image="lessons"
			text={strings("empty_topics")}
			style={styles.empty}
		/>
	)

	render() {
		return (
			<FlatList
				data={this.props.topics}
				renderItem={this.renderTopic}
				keyExtractor={item => `topic${item.id}`}
				ListEmptyComponent={this._renderEmpty}
			/>
		)
	}
}

const styles = StyleSheet.create({
	topic: {
		borderBottomColor: "lightgray",
		paddingTop: 6,
		paddingBottom: 6,
		borderBottomWidth: 1,
		marginLeft: 12
	},
	topicText: {
		alignSelf: "flex-start"
	},
	empty: {
		alignSelf: "center"
	}
})
