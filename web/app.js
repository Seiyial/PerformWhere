import './app.scss'
import axios from 'axios'

axios
.post('/api', { 'name': 'list_concert_halls' })
.then((reply) => console.log('REply', reply))
.catch(console.warn)
