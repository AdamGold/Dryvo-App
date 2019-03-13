import React, { Fragment } from "react"
import { StyleSheet, View, Text, FlatList } from "react-native"

export default class TopicsList extends React.Component {
	renderTopic = ({ item, index }) => {
		return (
			<View style={styles.topic}>
				<Text style={styles.topicText}>{item.title}</Text>
			</View>
		)
	}
	render() {
		return (
			<FlatList
				data={this.props.topics}
				renderItem={this.renderTopic}
				keyExtractor={item => `item${item.id}`}
			/>
		)
	}
}

const styles = StyleSheet.create({
	topic: {
		borderBottomColor: "lightgray",
		paddingTop: 6,
		paddingBottom: 6,
		borderBottomWidth: 1
	},
	topicText: {
		alignSelf: "flex-start",
		marginLeft: 12
	}
})
