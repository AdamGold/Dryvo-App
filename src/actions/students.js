const _constructAPIUrl = (page, search, orderByColumn, orderByMethod) => {
	let extra = ""
	if (orderByColumn) {
		extra += `&order_by=${orderByColumn} ${orderByMethod}`
	}
	if (search) extra += `&name=${search}`
	return "/teacher/students?limit=20&is_approved=true&page=" + page + extra
}

export const getStudents = async (fetchService, state) => {
	const { page, search, orderByColumn, orderByMethod } = state
	resp = await fetchService.fetch(
		_constructAPIUrl(page, search, orderByColumn, orderByMethod),
		{
			method: "GET"
		}
	)

	return {
		students: resp.json["data"],
		nextUrl: resp.json["next_url"]
	}
}
