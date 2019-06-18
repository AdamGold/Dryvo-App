// setup file
import Enzyme, { configure, shallow, render, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import Fetch from "../src/services/Fetch"
import { initialErrors } from "../src/reducers/errors"
configure({ adapter: new Adapter() })

// Make Enzyme functions available in all test files without importing
global.shallow = shallow
global.render = render
global.mount = mount

// Custom globals
global.testAsyncComponent = (wrapper, done, callback = _ => {}) => {
	setImmediate(() => {
		wrapper.update()
		try {
			callback(wrapper)
			expect(wrapper).toMatchSnapshot()
		} catch (e) {
			console.log(e)
		}

		done()
	})
}
global.dispatch = jest.fn(func => {
	return func(dispatch, () => {
		return { fetchService: new Fetch(), errors: initialErrors } // getState()
	})
})

global.navigation = {
	navigate: jest.fn(),
	addListener: (_, callback) => {
		callback()
	}
}
global.fetchService = new Fetch()
