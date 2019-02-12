import ReactNative from "react-native"
import i18n from "i18n-js"

// Import all locales
import he from "../locales/he.json"
import { LocaleConfig } from "react-native-calendars"

// Define the supported translations
i18n.translations = {
	he
}
i18n.locale = "he"

LocaleConfig.locales["he"] = {
	monthNames: i18n.t("monthNames"),
	monthNamesShort: i18n.t("monthNamesShort"),
	dayNames: i18n.t("dayNames"),
	dayNamesShort: i18n.t("dayNamesShort")
}

LocaleConfig.defaultLocale = "he"

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(true)
ReactNative.I18nManager.forceRTL(true)

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
	return i18n.t(name, params)
}

export default i18n
