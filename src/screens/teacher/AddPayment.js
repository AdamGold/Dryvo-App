import { createStackNavigator } from "react-navigation"
import AddPaymentChooseStudent from "./AddPaymentChooseStudent"
import AddPaymentChooseAmount from "./AddPaymentChooseAmount"
export default createStackNavigator(
	{ First: AddPaymentChooseStudent, Second: AddPaymentChooseAmount },
	{
		initialRouteKey: "First",
		headerMode: "none",
		navigationOptions: {
			headerVisible: false
		}
	}
)
