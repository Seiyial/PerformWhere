// This is too time-consuming


// const fs = require('fs')
// const holidays = require('@mobylogix/public-holidays')
// const { DateTime } = require('luxon')

// const filter = { country: 'sg', lang: 'en' }

// console.log('(*) Getting Holidays...')
// holidays(filter, (err, res) => {
// 	console.log('(*) Formatting...')
// 	let listOfHolidays = {}
// 	if (res) {
// 		res.map((ev) => {

// 			// Add Public Holiday
// 			const phStart = DateTime.fromISO(ev.start.toISOString(), { zone: 'utc' }).setZone('Asia/Singapore')
// 			const phEnd = DateTime.fromISO(ev.end.toISOString(), { zone: 'utc' }).setZone('Asia/Singapore').minus({ seconds: 1 })

// 			if (phStart.day === phEnd.day) throw 'PH seems to span multiple days. Refactor'

// 			const phName = ev.summary
// 			let phType = resolvePHType(phName)

// 			if (phName.downcase.includes('new year') && phType === 'PH') {
// 				// For New Year's day, create the PH via the PH Eve object
// 				return null

// 			} else if (phName.downcase.includes('new year') && phType === 'PH Eve') {
// 				// Create New year's day from the New Year's Eve item
// 				listOfHolidays[phStart.toISODate()] = { name: phName, type: phType }
				
// 			} else if (phTypes === 'PH Eve') {
// 				// For all Holidays except New Year, skip creating the New Year's Eve
// 				listOfHolidays[phS]
// 			}

// 			// Add Eve if the Calendar item is not an Eve or 'Observed'
// 			const shouldHaveEve = ev.summary.slice(-3) === 'Eve'



// 			const phEveStart = phStart.minus({ days: 1 })
// 			const phEveEnd = phStart.minus({ seconds: 1 })

			

// 			listOfHolidays.push({
// 				name: ev.summary + ' Eve',
// 				type: 'Eve of PH',
// 				start: phEveStart.toISO(),
// 				end: phEveEnd.toISO()
// 			})
// 		})

// 		console.log('(*) Writing to store...')
		
// 		fs.writeFile(__dirname + '/ph.json', JSON.stringify(listOfHolidays),
// 			(err) => {
// 				if (err) {
// 					console.error('(* generatePH.js) error at fs.writeFile', err)
// 				} else {
// 					console.log('(*) Recorded all known PH and PH Eve!')
// 				}
// 			}
// 		)

// 	} else if (err) {
// 		console.error('(*) Error getting public holidays', err)
// 	}
// })

// const resolvePHType = (name) => {
// 	const phLastWord = name.split(' ')[-1]
// 	if (phLastWord.downcase === 'eve') {
// 		return 'PH Eve'
// 	} else if (phLastWord.downcase === 'observed') {
// 		return 'PH Observed'
// 	} else {
// 		return 'PH'
// 	}
// }