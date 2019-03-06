import React from "react"
import { View, StyleSheet, Text, TouchableOpacity } from "react-native"
import { connect } from "react-redux"
import { strings } from "../../i18n"
import PageTitle from "../../components/PageTitle"
import { MAIN_PADDING, themeBlue } from "../../consts"
import { Icon, Button, Input } from "react-native-elements"

export class WorkDays extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.headerRow}>
					<PageTitle
						style={styles.title}
						title={strings("teacher.work_days.title")}
						leftSide={
							<Button
								icon={
									<Icon
										name="ios-close"
										type="ionicon"
										size={36}
									/>
								}
								onPress={() => {
									this.props.navigation.goBack()
								}}
								type="clear"
							/>
						}
					/>
				</View>
				<View style={styles.days}>
					<View style={styles.day}>
						<View style={styles.row}>
							<TouchableOpacity>
								<Icon
									name="ios-arrow-dropleft"
									type="ionicon"
								/>
							</TouchableOpacity>
							<Text style={styles.dayTitle}>יום א</Text>
							<Text style={styles.hours}>8:00-16:00</Text>
						</View>
						<View style={styles.hoursRow}>
							<Input
								value="hello"
								inputStyle={styles.input}
								containerStyle={styles.inputContainer}
							/>
							<Text>-</Text>
							<Input
								value="yes"
								inputStyle={styles.input}
								containerStyle={styles.inputContainer}
							/>
						</View>
						<TouchableOpacity>
							<Text style={styles.addHours}>Add</Text>
						</TouchableOpacity>
					</View>
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
		marginTop: 4
	},
	headerRow: {
		flex: 1,
		paddingLeft: MAIN_PADDING,
		paddingRight: MAIN_PADDING,
		maxHeight: 50
	},
	days: {
		flex: 1,
		marginLeft: MAIN_PADDING,
		marginRight: MAIN_PADDING
	},
	day: {
		marginTop: 12
	},
	dayTitle: {
		fontWeight: "bold",
		marginLeft: 8
	},
	row: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "flex-start"
	},
	hoursRow: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center"
	},
	hours: {
		marginLeft: "auto"
	},
	inputStyle: {},
	inputContainer: {
		maxWidth: 150
	},
	addHours: {
		alignSelf: "flex-start",
		color: themeBlue,
		marginTop: 8
	}
})

export default connect()(WorkDays)
