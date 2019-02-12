import ReactNative from "react-native"
import i18n from "i18n-js"

// Import all locales
import he from "../locales/he.json"
import { LocaleConfig } from "react-native-calendars"

LocaleConfig.locales["he"] = {
	monthNames: [
		"ינואר",
		"פברואר",
		"מרץ",
		"אפריל",
		"מאי",
		"יוני",
		"יולי",
		"אוגוסט",
		"ספטמבר",
		"אוקטובר",
		"נובמבר",
		"דצמבר"
	],
	monthNamesShort: [
		"ינו.",
		"פבר.",
		"מרץ",
		"אפר.",
		"מאי",
		"יוני",
		"יולי",
		"אוג.",
		"ספט.",
		"אוק.",
		"נוב.",
		"דצב."
	],
	dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
	dayNamesShort: ["א", "ב", "ג", "ד", "ה", "ו", "ש"]
}

LocaleConfig.defaultLocale = "he"

// Define the supported translations
i18n.translations = {
	he
}
i18n.locale = "he"

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(true)
ReactNative.I18nManager.forceRTL(true)

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
	return i18n.t(name, params)
}

export default i18n
