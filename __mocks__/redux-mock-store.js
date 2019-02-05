import configureStore from "redux-mock-store"
import thunk from "redux-thunk"

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

export default mockStore
