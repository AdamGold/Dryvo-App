import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import { MAIN_PADDING } from "../../consts"
import { Icon, Button } from "react-native-elements"

export class WorkDays extends React.Component {
	constructor(props) {
		super(props)
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
						title={strings("teacher.new_lesson.title")}
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
		marginTop: 5
	},
	headerRow: {
		flexDirection: "row",
		flex: 1,
		maxHeight: 50,
		paddingLeft: MAIN_PADDING
	}
})

export default connect()(WorkDays)
