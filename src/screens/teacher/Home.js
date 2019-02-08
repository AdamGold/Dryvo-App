import React from "react"
import { ScrollView, View, Text, Image, StyleSheet } from "react-native"
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
			<ScrollView style={styles.container}>
				<View style={styles.welcomeHeader}>
					<Image
						style={styles.profilePic}
						source={{
							uri:
								"https://images.unsplash.com/photo-1535643302794-19c3804b874b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80"
						}}
					/>
					<Text>
						{strings("teacher.home.welcome", { name: "משה" })}
					</Text>
				</View>
				<ShadowRect style={styles.schedule}>
					<Text>{strings("teacher.home.current_lesson")}</Text>
					<View style={styles.lessonRow}>
						<StudentWithPic name="רונן רוזנטל" />
						<Text>13:00-13:40</Text>
					</View>
					<View style={styles.seperator} />
					<Text>{strings("teacher.home.next_lesson")}</Text>
					<View style={styles.lessonRow}>
						<StudentWithPic name="רונן רוזנטל" />
						<Text>13:00-13:40</Text>
					</View>
				</ShadowRect>
				<ShadowRect style={{ marginTop: 26 }}>
					<Text>{strings("teacher.home.monthly_amount")}</Text>
				</ShadowRect>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20
	},
	schedule: { minHeight: 230 },
	welcomeHeader: {
		alignSelf: "center",
		alignItems: "center",
		marginBottom: 32
	},
	profilePic: {
		width: 74,
		height: 74,
		borderRadius: 37,
		marginBottom: 16
	},
	lessonRow: {
		marginTop: 20,
		flex: 1,
		flexDirection: "row",
		maxHeight: 34
	},
	seperator: {
		flex: 1,
		width: "100%",
		borderBottomColor: "rgb(212, 212, 212)",
		borderBottomWidth: 1,
		marginTop: 20,
		marginBottom: 20
	}
})

export default connect()(Home)
