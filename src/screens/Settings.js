import React from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { connect } from "react-redux"
import { strings } from "../i18n"
import ShadowRect from "../components/ShadowRect"

export class Settings extends React.Component {
	constructor(props) {
		// only here for the test suite to work
		super(props)
	}

	render() {
		return (
			<View style={styles.container}>
				<ShadowRect>
					<Text>Notifications</Text>
				</ShadowRect>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})

export default connect()(Settings)
