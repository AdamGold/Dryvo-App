import React from "react"
import { View, Text, Button, StyleSheet } from "react-native"
import { logout } from "../../actions/auth"
import { connect } from "react-redux"
import ShadowRect from "../../components/ShadowRect"
import StudentWithPic from "../../components/StudentWithPic"
import { strings } from "../../i18n"

class Home extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<View style={styles.container}>
				<ShadowRect style={{ maxHeight: 230 }}>
					<Text>{strings("teacher.home.current_lesson")}</Text>
					<View style={styles.lessonRow}>
						<StudentWithPic name="רונן רוזנטל" />
						<Text>13:00-13:40</Text>
					</View>
					<Text>{strings("teacher.home.next_lesson")}</Text>
					<View style={styles.lessonRow}>
						<StudentWithPic name="רונן רוזנטל" />
						<Text>13:00-13:40</Text>
					</View>
				</ShadowRect>
				<ShadowRect style={{ marginTop: 26 }}>
					<Text>{strings("teacher.home.monthly_amount")}</Text>
				</ShadowRect>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20
	},
	lessonRow: {
		alignItems: "flex-start",
		flex: 1,
		flexDirection: "row"
	}
})

export default connect()(Home)
