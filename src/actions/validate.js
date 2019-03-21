// https://medium.com/@pavsidhu/validating-forms-in-react-native-7adc625c49cf
import validatejs from "validate.js"
import { strings } from "../i18n"

export default function validate(fieldName, value, validation) {
	// Validate.js validates your values as an object
	// e.g. var form = {email: 'email@example.com'}
	// Line 8-9 creates an object based on the field name and field value
	var formValues = {}
	formValues[fieldName] = value

	// Line 13-14 creates an temporary form with the validation fields
	// e.g. var formFields = {
	//                        email: {
	//                         presence: {
	//                          message: 'Email is blank'
	//                         }
	//                       }
	var formFields = {}
	formFields[fieldName] = validation[fieldName]

	// The formValues and validated against the formFields
	// the variable result hold the error messages of the field
	const result = validatejs(formValues, formFields)

	// If there is an error message, return it!
	if (result) {
		// Return only the field error message if there are multiple
		return result[fieldName][0]
	}

	return null
}

export const loginValidation = {
	email: {
		email: {
			message: "^" + strings("signin.invalid_email")
		}
	},

	password: {
		length: {
			minimum: 5,
			message: "^" + strings("signin.invalid_password")
		}
	}
}

export const registerValidation = {
	...loginValidation,
	name: {
		length: {
			minimum: 1,
			message: "^" + strings("signin.invalid_field")
		}
	},

	area: {
		length: {
			minimum: 1,
			message: "^" + strings("signin.invalid_field")
		}
	}
}
