const fs = require('fs')

const execute = () => {
	const targetFile = __dirname + '/sessionSecret.js'
	console.log('(*) Server generating new session key to ' + targetFile + '...')
	fs.writeFile(targetFile, generateSession(32), (err, _) => {
		if (err) {
			console.error(err)
		}
		if (_) { console.warn(_) }
		console.log('(*) Generated new session key 🆗')
	})
}

// https://stackoverflow.com/a/1349426
const generateSession = (secretLength) => {
	let result = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-';

	for (var i = 0; i < secretLength; i++)
		result += possible.charAt(Math.floor(Math.random() * possible.length));

	return `module.exports = { sk: "${result}" }`
}

execute()
