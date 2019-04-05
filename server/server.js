const simples = require('simples')
const path = require('path')
const staticDir = path.resolve(__dirname, '../dist')
const port = 8502

const App = simples(port, {
	static: { enabled: true, index: ['index.html'], location: '../dist' }
}, (status) => console.log('simples started', status))

App.on('start', (conn) => {
	console.log('(*) Server is up on Port', port, '!')
})

App.use((conn, next) => {
	console.log(conn.method, conn.path, conn._router)
	
	// Static File Middleware: Return static files if request is GET '/dist/<anything>'
	if (conn.method === 'GET' && conn.path.startsWith('/dist/')) {

		// get the request path and strip first 5 chars ('/dist/')
		const reqPath = conn.path.substr(5)

		// absolute path of requested resource
		const absPath = path.join(staticDir, reqPath)
		console.log('ABSPATH', reqPath, absPath);
		
		// check that absolute path is within static dir before sending content
		// conn.drain(static(reqPath), next)
	}

	next()
})

App.get('/', (conn) => {
	conn.drain(static('/index.html'))
})

App.on('error', (conn) => {
	console.log('(*) Error', conn)
})

const static = (distPath) => (path.join(__dirname, '../dist') + distPath)