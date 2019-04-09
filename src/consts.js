import { strings } from "./i18n"

export const TOKEN_KEY = "login_token"
export const REFRESH_TOKEN_KEY = "refresh_token"
export const NOTIFICATIONS_KEY = "notifications"
export const ROOT_URL = "https://dryvo.herokuapp.com"
export const API_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSS"
export const SHORT_API_DATE_FORMAT = "YYYY-MM-DD"
export const DISPLAY_SHORT_DATE_FORMAT = "DD.MM.YYYY"
export const DATE_FORMAT = "DD/MM/YYYY"
export const DEFAULT_IMAGE =
	"https://res.cloudinary.com/hsmkon3br/image/upload/c_thumb,g_face,h_80,w_80/v1554188012/678099-profile-filled-256.png"
export const DEFAULT_IMAGE_MAX_SIZE = 200
export const DEFAULT_MESSAGE_TIME = 1000
export const STORAGE_PREFIX = "Dryvo_"
export const DEFAULT_ERROR = strings("default_error")
export const MAIN_PADDING = 26
export const DEFAULT_DURATION = 40
export const NAME_LENGTH = 16
export const colors = {
	blue: "rgb(12,116,244)",
	green: "rgb(24, 199, 20)"
}
export const calendarTheme = {
	textSectionTitleColor: "#000",
	dayTextColor: "#000",
	textDisabledColor: "rgb(155,155,155)",
	textDayFontFamily: "Assistant",
	textMonthFontFamily: "Assistant",
	textDayHeaderFontFamily: "Assistant",
	todayTextColor: "#000",
	selectedDayTextColor: "#fff",
	selectedDayBackgroundColor: colors.blue,
	textMonthFontWeight: "bold",
	textDayFontWeight: "500",
	selectedDayfontWeight: "bold",
	textDayFontSize: 16,
	textMonthFontSize: 16,
	textDayHeaderFontSize: 16
}
export const floatButtonOnlyStyle = {
	backgroundColor: colors.blue,
	width: 160,
	height: 56,
	borderRadius: 28,
	alignItems: "center",
	justifyContent: "center",
	shadowColor: colors.blue,
	shadowOffset: {
		width: 0,
		height: 8
	},
	shadowOpacity: 0.5,
	shadowRadius: 16,
	elevation: 8
}
export const fullButton = {
	...floatButtonOnlyStyle,
	position: "absolute",
	bottom: 0,
	width: "100%",
	borderRadius: 0
}
