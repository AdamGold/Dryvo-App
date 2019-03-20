import { createStackNavigator } from "react-navigation"
import SignUpAs from "./SignUpAs"
import { SignUp } from "./SignUp"

export default createStackNavigator(
	{ First: SignUpAs, Second: SignUp },
	{
		initialRouteKey: "First",
		headerMode: "none",
		navigationOptions: {
			headerVisible: false
		}
	}
)
