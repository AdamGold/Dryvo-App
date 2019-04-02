function FormDataMock() {
	this.append = jest.fn()
}
global.FormData = FormDataMock
