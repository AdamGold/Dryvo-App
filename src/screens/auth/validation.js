export const loginValidation = {
	email: {
		email: {
			message: "^האימייל אינו תקני."
		}
	},

	password: {
		length: {
			minimum: 5,
			message: "^סיסמתך צריכה לכלול לפחות חמישה תווים."
		}
	}
}

export const registerValidation = {
	email: {
		email: {
			message: "^האימייל אינו תקני."
		}
	},

	name: {
		length: {
			minimum: 1,
			message: "^שדה השם הוא חובה."
		}
	},

	area: {
		length: {
			minimum: 1,
			message: "^שדה האיזור מגורים הוא חובה."
		}
	},

	password: {
		length: {
			minimum: 5,
			message: "^סיסמתך צריכה לכלול לפחות חמישה תווים."
		}
	}
}
