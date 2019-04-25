module.exports = {
	info: {
		name: 'SOTA Concert Hall',
		location: 'CBD',
		seating: 'Seats 628 (378 stalls, 182 circle, 68 restricted viewing in circle)',
		extraInfo: 'Has a the Grand Piano available at $600/day; Projector is available at $800/day; 4 Mics are free but additionals are $20/day. Check the rates document for more.'
	},
	calculateFees: (Request) => {
		const fees = []

		const ratesByType = {
			'p-arts': {
				perfBaseFee: [2400.00, '15% Box Office sales, whichever is higher.'],
				perfBaseHrs: 4,
				perfAddHr: 650.00,
				peakSurcharge: 500.00,
				peakDays: ['Friday', 'Saturday', 'Sunday', 'PH', 'PH Eve'],
				rehBaseFee: 1400.00,
				rehBaseHrs: 4,
				rehAddHr: 400.00,
				rehPeakSurcharge: 500.00,
				darkDayRate: 1000.00
			},
			'np-arts': {
				perfBaseFee: [2200.00, '15% Box Office sales, whichever is higher. DISCLAIMER: SOTA\'s rates document states that "NPO rates apply only to Singapore government agencies and registered non-profit organizations."'],
				perfBaseHrs: 4,
				perfAddHr: 600.00,
				peakSurcharge: 500.00,
				peakDays: ['Friday', 'Saturday', 'Sunday', 'PH', 'PH Eve'],
				rehBaseFee: 1200.00, // Note: Rehearsal is OPTIONAL
				rehBaseHrs: 4,
				rehAddHr: 350.00,
				rehPeakSurcharge: 500.00,
				darkDayRate: 800.00
			}
		}

		const r = ratesByType[Request.evType]

		// Base Rate
		Request.calcBaseRate({
			label: 'Concert first 4h',
			description: '15% Box Office sales, whichever is higher',
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
			label: 'Soundcheck (Optional) first 4h',
			baseRate: r.rehBaseFee,
			baseHrs: r.rehBaseHrs,
		})

		if (Request.rehDur > r.rehBaseHrs) {
			Request.calcAddHrs({
				label: 'Soundcheck (Optional) Addtl. hrs',
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

		const _crewDur = (Request.dur > 4 ? Request.dur : 4) + 
			(Request.rehDur > 4 ? Request.rehDur : 4)
		const _crewHrs = _crewDur > 4 ? _crewDur : 4

		// Helpers
		Request.calcManHr({
			label: 'Technical Crew',
			description: 'Minimum 4 hours for each hire. Add $10 per person per hour if hiring is 11:30pm~8am',
			hrs: _crewHrs,
			pax: Request.numTC,
			rate: 23
		})

		Request.calcManHr({
			label: 'Ushers',
			hrs: (Request.dur > 4 ? Request.dur : 4),
			pax: Request.numUsh,
			rate: 14
		})
	}
}