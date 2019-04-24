module.exports = {
	info: {
		name: 'Victoria Concert Hall',
		location: 'CBD',
		seating: 'Seats 673',
	},
	feeCalculator: (Request) => {
		const fees = []

		const ratesByType = {
			'p-arts': {
				perfBaseFee: [3200, 'Or 15% Box Office sales, whichever is higher. For VCH, PerformWhere assumes this is a ticketed event'],
				perfBaseHrs: 4,
				perfAddHr: 950.00,
				peakSurcharge: 800.00,
				peakDays: ['Saturday', 'Sunday', 'PH Eve', 'PH'],
				rehBaseFee: 750.00,
				rehBaseHrs: 4,
				rehAddHr: 220.00,
				rehPeakSurcharge: 500.00,
				darkDayRate: 1100.00
			},
			'np-arts': {
				perfBaseFee: [2800.00, 'Or 15% Box Office sales, whichever is higher. For VCH, PerformWhere assumes this is a ticketed event'],
				perfBaseHrs: 4,
				perfAddHr: 750.00,
				peakSurcharge: 600.00,
				peakDays: ['Saturday', 'Sunday', 'PH Eve', 'PH'],
				rehBaseFee: 650.00,
				rehBaseHrs: 4,
				rehAddHr: 200.00,
				rehPeakSurcharge: 400.00,
				darkDayRate: 900.00
			}
		}

		// fixed rates
		const fr = {
			techCrewPerPaxPerHr: [24.61, 'Please manually add $10.70/pax/hr if event is 12am to 8am'],
			techCrewMinHr: 4,
			usherFreeNum: 4,
			usherMinHr: 3,
			usherAddManHr: 13.91
		}

		const r = ratesByType[Request.evType]

		// Base Rate
		Request.calcBaseRate({
			label: 'Concert first 4 hours',
			description: 'or 15% Box Office sales, whichever is higher',
			baseRate: r.perfBaseFee[0],
			baseHrs: r.perfBaseHrs
		})

		if (Request.dur > r.perfBaseHrs) {
			Request.calcAddHrs({
				label: 'Concert',
				description: 'Hours not covered by base rate',
				rate: r.perfAddHr,
				qty: Math.ceil(Request.dur - r.perfBaseHrs)
			})
		}

		Request.calcPeakSurcharge({
			label: 'Concert',
			rate: r.peakSurcharge,
			onlyIfPeakTypes: r.peakDays,
		})

		// Rehearsal
		Request.calcBaseRate({
			label: 'Soundcheck',
			baseRate: r.rehBaseFee,
			baseHrs: r.rehBaseHrs
		})

		if (Request.rehDur > r.rehBaseHrs) {
			Request.calcAddHrs({
				label: 'Soundcheck',
				qty: Math.ceil(Request.rehDur, r.rehBaseHrs),
			})
		}
	}
}