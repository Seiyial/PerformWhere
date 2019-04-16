module.exports = {
	info: {
		name: 'Esplanade Recital Studio',
		location: 'CBD',
		seating: 'Seats 245 (maximum), Retractable bleacher seating',
	},
	feeCalculator: (Request) => {
		const fees = []

		// 1. Concert Hall Rate
		const ratesByType = {
			'p-arts': {
				perfBaseFee: [588.50, ''],
				perfBaseHrs: 4.5,
				perfAddHr: 160.50,
				peakSurcharge: 0.00,
				peakDays: [],
				rehBaseFee: 321.00,
				rehBaseHrs: 4,
				rehAddHr: 139.10,
				rehPeakSurcharge: 0.00,
				darkDayRate: 535.00
			},
			'np-arts': {
				perfBaseFee: [481.50, ''],
				perfBaseHrs: 4.5,
				perfAddHr: 139.10,
				peakSurcharge: 0.00,
				peakDays: [],
				rehBaseFee: 267.50,
				rehBaseHrs: 4,
				rehAddHr: 107.00,
				rehPeakSurcharge: 0.00,
				darkDayRate: 481.50
			},
			'fundraising': {
				perfBaseFee: [856.00, 'flat fee'],
				perfBaseHrs: 4.5,
				perfAddHr: 214.00,
				peakSurcharge: 214.00,
				peakDays: ['Friday', 'Saturday', 'PH Eve'],
				rehBaseFee: 535.00,
				rehBaseHrs: 4,
				rehAddHr: 160.50,
				rehPeakSurcharge: 160.50,
				darkDayRate: 1700.00
			},
			'private': {
				perfBaseFee: [1926.00, 'Incl. GST, or 18% of Box Office sales for ticketed events (subject to GST), whichever is higher'],
				perfBaseHrs: 4.5,
				perfAddHr: 561.75,
				peakSurcharge: 1926.00,
				peakDays: ['Friday', 'Saturday', 'PH Eve'],
				rehBaseFee: 1926.00,
				rehBaseHrs: 4,
				rehAddHr: 561.75,
				rehPeakSurcharge: 1926,
				darkDayRate: 0
			}
		}

		// fixed rates
		const fr = {
			techCrewPerPaxPerHr: [24.61, 'Extra $10.70/pax/hr if event is 12am to 8am'],
			techCrewMinHr: 4,
			usherFreeNum: 4,
			usherMinHr: 3,
			usherAddManHr: 13.91
		}

		const r = ratesByType[Request.evType]

		// Concert base rate
		fees.push(Request.calcBaseRate({
			label: 'Concert',
			description: r.perfBaseFee[1],
			rate: r.perfBaseFee[0],
			baseHrs: r.perfBaseHrs,
		}))

		// Additional Hours
		if (Request.dur > r.perfBaseHrs) {
			fees.push(Request.calcAddHrs({
				label: 'Concert',
				description: 'Additional per hour or part thereof',
				qty: Math.ceil(r.perfBaseHrs - Request.dur),
				rate: r.perfAddHr
			}))
		}

		// Peak Surcharge
		if (Request.isPeak(r.peakDays)) {
			fees.push(Request.calcPeakSurcharge({
				label: 'Concert',
				peakDays: r.peakDays,
				rate: r.peakSurcharge
			}))
		}

		// Rehearsal Base Rate
		fees.push(Request.calcBaseRate({
			label: 'Rehearsal',
			// description: r.rehBaseFee,
			rate: r.rehBaseFee,
			baseHrs: r.rehBaseHrs,
		}))

		// Add Hrs
		if (Request.rehDur > r.rehBaseHrs) {
			fees.push(Request.calcAddHrs({
				label: 'Rehearsal',
				description: 'Additional per hour or part thereof',
				qty: Math.ceil(r.rehBaseHrs - Request.rehDur),
				rate: r.rehAddHr
			}))
		}

		// Peak Surcharge
		if (Request.isPeak(r.peakDays)) {
			fees.push(Request.calcPeakSurcharge({
				label: 'Rehearsal',
				peakDays: r.peakDays,
				rate: r.rehPeakSurcharge
			}))
		}

		// Dark Days
		if (Request.evType !== 'private' && Request.numDD > 0) {
			fees.push(Request.calc({
				label: 'Dark Day Rate',
				qty: Request.numDD,
				rate: r.darkDayRate
			}))
		}

		// Tech Crew
		fees.push(Request.calcManHr({
			label: 'Technical Crew',
			description: fr.techCrewPerPaxPerHr[1],
			rate: fr.techCrewPerPaxPerHr[0],
			pax: Request.numTC,
			hrs: (Request.dur + Request.rehDur)
		}))

		// Ushers
		fees.push(Request.calcManHr({
			label: 'Ushers',
			description: `First ${fr.usherFreeNum} free`,
			pax: fr.usherFreeNum,
			hrs: (Request.dur + Request.rehDur),
			rate: 0
		}))

		if (Request.numUsh > fr.usherFreeNum) {
			fees.push(Request.calcManHr({
				label: 'Additional Ushers',
				pax: (Request.numUsh - fr.usherFreeNum),
				hrs: (Request.dur + Request.rehDur),
				rate: fr.usherAddManHr
			}))
		}

		return fees
	}
}