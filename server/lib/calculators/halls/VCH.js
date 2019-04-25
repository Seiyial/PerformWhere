module.exports = {
	info: {
		name: 'Victoria Concert Hall',
		location: 'CBD',
		seating: 'Seats 673',
	},
	calculateFees: (Request) => {
		const fees = []

		const ratesByType = {
			'p-arts': {
				perfBaseFee: [3200, 'Or 15% Box Office sales, whichever is higher. For VCH, PerformWhere IS ASSUMING this is a ticketed event. If not, refer to the rates document'],
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
				perfBaseFee: [2800.00, 'Or 15% Box Office sales, whichever is higher. For VCH, PerformWhere IS ASSUMING this is a ticketed event. If not, refer to the rates document'],
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
			description: r.perfBaseFee[1],
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
			onlyIfPeakTypes: r.peakDays
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

		Request.calcPeakSurcharge({
			label: 'Soundcheck',
			rate: r.rehPeakSurcharge,
			onlyIfPeakTypes: r.peakDays
		})

		// Dark Days
		if (Request.numDD) {
			Request.calc({
				label: 'Dark Days',
				rate: r.darkDayRate,
				qty: Request.numDD,
				min: Request.numDD == 0
			})
		}

		const _stageDur = Request.dur + Request.rehDur

		// Helpers
		Request.calcManHr({
			label: 'Technical Crew',
			description: 'Minimum 4 hours for each hire. Add $10 per person per hour if hiring is midnight~8am',
			hrs: (_stageDur > 4 ? _stageDur : 4),
			pax: Request.numTC,
			rate: 23
		})

		Request.calcManHr({
			label: 'Ushers (complimentary)',
			description: "PROVIDED as part of the performance/event package 1h prior to the performance/event time up to a max of 4h. We aren't aware of the actual number provided. Additionals cost 13/person/hr, and need to be hired for at least 3h each.",
			hrs: (Request.dur > 4 ? Request.dur : 4),
			pax: '?',
			rate: 13
		})
	}
}