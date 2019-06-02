import { View } from "react-native"

const React = require("react")
const mockComponent = props => <View>{props.children}</View>
jest.mock("rn-content-loader", () => mockComponent)
