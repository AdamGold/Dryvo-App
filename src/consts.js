import { strings } from "./i18n"

export const TOKEN_KEY = "login_token"
export const REFRESH_TOKEN_KEY = "refresh_token"
export const ROOT_URL = "https://dryvo.herokuapp.com"
export const API_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSS"
export const DATE_FORMAT = "DD/MM/YYYY"
export const STORAGE_PREFIX = "Dryvo_"
export const DEFAULT_ERROR = strings("default_error")
export const MAIN_PADDING = 26
export const DEFAULT_DURATION = 40
export const themeBlue = "rgb(12,116,244)"
export const calendarTheme = {
	textSectionTitleColor: "#000",
	dayTextColor: "#000",
	textDisabledColor: "rgb(155,155,155)",
	textDayFontFamily: "Assistant",
	textMonthFontFamily: "Assistant",
	textDayHeaderFontFamily: "Assistant",
	todayTextColor: "#000",
	selectedDayTextColor: "#fff",
	selectedDayBackgroundColor: themeBlue,
	textMonthFontWeight: "bold",
	textDayFontWeight: "500",
	selectedDayfontWeight: "bold",
	textDayFontSize: 16,
	textMonthFontSize: 16,
	textDayHeaderFontSize: 16
}
export const floatButtonOnlyStyle = {
	backgroundColor: themeBlue,
	width: 160,
	height: 56,
	borderRadius: 28,
	alignItems: "center",
	justifyContent: "center",
	shadowColor: themeBlue,
	shadowOffset: {
		width: 0,
		height: 8
	},
	shadowOpacity: 0.5,
	shadowRadius: 16,
	elevation: 8
}
export const floatButton = {
	...floatButtonOnlyStyle,
	position: "absolute",
	bottom: 12,
	right: 26,
	alignSelf: "flex-end"
}
