import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage"
import AsyncStorage from "@react-native-community/async-storage"
import { STORAGE_PREFIX as PREFIX } from "../consts"

export default class Storage {
	static async getItem(key, secure = false) {
		try {
			if (secure === true) {
				return await this._getSecure(key)
			} else {
				return await this._getNormal(key)
			}
		} catch (error) {
			return null
		}
	}

	static async _getNormal(key) {
		return await AsyncStorage.getItem(`${PREFIX}${key}`)
	}

	static async _getSecure(key) {
		return await RNSecureStorage.get(`${PREFIX}${key}`)
	}

	static async setItem(key, val, secure = false) {
		try {
			if (secure === true) {
				await this._setSecure(key, val)
			} else {
				await this._setNormal(key, val)
			}
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	static async _setNormal(key, val) {
		await AsyncStorage.setItem(`${PREFIX}${key}`, val)
		console.debug(`saved ${key}=${val}`)
	}

	static async _setSecure(key, val) {
		// {accessible: ACCESSIBLE.WHEN_UNLOCKED} -> This for IOS
		await RNSecureStorage.set(`${PREFIX}${key}`, val, {
			accessible: ACCESSIBLE.WHEN_UNLOCKED
		})
		console.debug(`saved ${key}=${val}`)
	}

	static async removeItem(key, secure = false) {
		try {
			if (secure === true) {
				if (await this.getItem(key, true)) {
					await RNSecureStorage.remove(`${PREFIX}${key}`)
					console.log(`Removed ${key}`)
				}
			} else {
				if (await this.getItem(key, false)) {
					await AsyncStorage.removeItem(`${PREFIX}${key}`)
					console.log(`Removed ${key}`)
				}
			}
		} catch (error) {
			console.log(error)
			return null
		}
	}
}
