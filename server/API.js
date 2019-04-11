const {
	list_concert_halls_query,
	calculate_by_reqs_query
} = require('./lib/calculators')

const apiGateway = (conn) => {

	// set response Content-Type
	conn.type('application/json')

	conn.parse({
		json: (err, incoming) => {
			if (err) {
				resolveAPI({ success: false, errMsg: 'Issue handling your request' }, 400)
			} else {
				// Package Query as a single object so that Query modules will be able to
				// resolve the API on their own
				const resolve = (result, statusCode = 200) => resolveAPI(conn, result, statusCode)
				const { query, params, auth } = incoming
				const Context = { query, params, auth, resolve }
				performQuery(Context)
			}
		}
	})
}

const resolveAPI = (conn, result, statusCode = 200) => {
	conn.status(statusCode)
	conn.send(JSON.stringify(result))
}

// USAGE of `Context`
// Context.resolve({ success: false, errMsg: 'failed yall' })
// Context.resolve({ success: true, results: { a: 'b', c: 'd' } })

const performQuery = (Context) => {
	switch (Context.query) {
		case 'list_concert_halls': list_concert_halls_query(Context); break;
		case 'calculate_by_reqs': calculate_by_reqs_query(Context); break;
		default: Context.resolve({ success: false, errMsg: 'Unknown Qy' }, 400)
	}
}

module.exports = apiGateway