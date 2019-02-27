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
	monthNames: i18n.t("date.month_names").slice(1),
	monthNamesShort: i18n.t("date.abbr_month_names").slice(1),
	dayNames: i18n.t("date.day_names"),
	dayNamesShort: i18n.t("date.abbr_day_names")
}

LocaleConfig.defaultLocale = "he"

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(true)
ReactNative.I18nManager.forceRTL(true)

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
	return i18n.t(name, params)
}

export function dates(format, date) {
	return i18n.l(format, date)
}

export default i18n
