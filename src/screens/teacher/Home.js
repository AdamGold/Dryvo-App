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
				<View testID="welcomeHeader" style={styles.welcomeHeader}>
					<Image
						style={styles.profilePic}
						source={{
							uri:
								"https://images.unsplash.com/photo-1535643302794-19c3804b874b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80"
						}}
					/>
					<Text style={styles.welcomeText}>
						{strings("teacher.home.welcome", { name: "משה" })}
					</Text>
				</View>
				<ShadowRect style={styles.schedule}>
					<Text style={styles.rectTitle}>
						{strings("teacher.home.current_lesson")}
					</Text>
					<View style={styles.lessonRow}>
						<StudentWithPic name="רונן רוזנטל" />
						<Text style={styles.hour}>13:00-13:40</Text>
					</View>
					<View style={styles.seperator} />
					<Text style={styles.rectTitle}>
						{strings("teacher.home.next_lesson")}
					</Text>
					<View style={styles.lessonRow}>
						<StudentWithPic name="רונן רוזנטל" />
						<Text style={styles.hour}>13:00-13:40</Text>
					</View>
				</ShadowRect>
				<Text style={styles.fullSchedule}>
					{strings("teacher.home.full_schedule")}
				</Text>
				<ShadowRect>
					<Text style={styles.rectTitle}>
						{strings("teacher.home.monthly_amount")}
					</Text>
					<View style={styles.amountView}>
						<Text style={styles.amount}>13,800₪</Text>
						<Text style={styles.addPayment}>
							{strings("teacher.home.add_payment")}
						</Text>
					</View>
					<View style={styles.seperator} />
					<View style={{ ...styles.lessonRow, ...{ marginTop: 0 } }}>
						<StudentWithPic name="רונן רוזנטל" />
						<Text style={styles.amountOfStudent}>200₪</Text>
					</View>
					<View style={styles.lessonRow}>
						<StudentWithPic name="רונן רוזנטל" />
						<Text style={styles.amountOfStudent}>200₪</Text>
					</View>
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
		marginBottom: 20
	},
	welcomeText: {
		fontFamily: "Assistant-Light",
		fontSize: 24
	},
	profilePic: {
		width: 74,
		height: 74,
		borderRadius: 37,
		marginBottom: 16
	},
	rectTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "rgb(121, 121, 121)"
	},
	lessonRow: {
		marginTop: 20,
		flex: 1,
		flexDirection: "row",
		maxHeight: 34,
		alignItems: "center"
	},
	seperator: {
		width: "100%",
		borderBottomColor: "rgb(212, 212, 212)",
		borderBottomWidth: 1,
		marginTop: 20,
		marginBottom: 20
	},
	hour: {
		flex: 0.5,
		marginRight: "auto",
		marginTop: -2
	},
	fullSchedule: {
		color: "rgb(12, 116, 244)",
		marginTop: 24,
		marginBottom: 24,
		alignSelf: "center",
		fontWeight: "bold"
	},
	amountView: {
		marginTop: 16,
		alignSelf: "center"
	},
	amount: {
		fontFamily: "Assistant-Light",
		fontSize: 44,
		color: "rgb(24, 199, 20)"
	},
	addPayment: {
		color: "rgb(12, 116, 244)",
		fontWeight: "bold",
		marginTop: 16,
		alignSelf: "center"
	},
	amountOfStudent: {
		flex: 0.5,
		marginRight: "auto",
		marginTop: -2,
		color: "rgb(24, 199, 20)"
	}
})

export default connect()(Home)
