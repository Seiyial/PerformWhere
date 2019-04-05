const simples = require('simples')
const path = require('path')
const API = require('./API')
const staticDir = path.resolve(__dirname, '../dist')
const port = 8502

const App = simples(port, {
	config: {
		session: {
			enabled: true,
			preferred: 'gzip'
		},
		static: {
			enabled: true,
			index: ['index.html'],
			location: staticDir
		},
		logging: {
			enabled: true
		}
	}
})

App.use((conn, next) => { console.log(conn.method, conn.path); next() })
App.on('start', (conn) => console.log('(*) Server is up on Port', port, '!'))
App.on('error', (conn) => console.error('(*) Error', conn))

App.post('/api', API)