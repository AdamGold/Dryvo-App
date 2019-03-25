import ExtendableError from "es6-error"

export class APIError extends ExtendableError {}

export const getLatestError = errors => {
	if (errors.length) {
		return errors[errors.length - 1] // last error
	}
	return ""
}
