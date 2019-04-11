const formatRequest = require('../util/formatRequest')

module.exports = (Context) => {
	Context.Request = formatRequest(Context.params)

	const { resolve, Request } = Context
	resolve({ success: true, data: { foo: 'Bar' }})
}