import { strings } from "../../i18n"

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
	email: {
		email: {
			message: "^" + strings("signin.invalid_email")
		}
	},

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
	},

	password: {
		length: {
			minimum: 5,
			message: "^" + strings("signin.invalid_email")
		}
	}
}
