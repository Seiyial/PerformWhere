module.exports = {
	info: {
		name: 'Singapore Conference Hall (SCH)',
		location: 'Tanjong Pagar',
		seating: 'SCO Concert Hall | Seats 831 (795 seats, 36 gallery)',
		extraInfo: 'Using SCO Concert Hall Orchestra Package. Same for for-profit and non-profit orchestras. 1h meal break is COMPULSORY for events across more than 1 time slot. Various items like a few mics, upright piano w/o tuning are provided foc.'
	},
	calculateFees: (Request) => {
		const r = {
			perfBaseFee: [2100.00, '18% Box Office sales, whichever is higher.'],
			perfBaseHrs: 4,
			perfAddHr: 525.00,
			peakSurcharge: 400.00,
			peakDays: ['Saturday', 'Sunday', 'PH', 'PH Eve'],
			rehBaseFee: 900.00,
			rehBaseHrs: 4,
			rehAddHr: 225.00,
			cleaningFee: 100
		}

		// Base Rate
		Request.calcBaseRate({
			label: 'Concert first 4h',
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
			label: 'Peak Surcharge',
			description: 'Covers Soundcheck AND Concert, as long as they lie on the same day',
			rate: r.peakSurcharge,
			onlyIfPeakTypes: r.peakDays
		})

		// Rehearsal
		Request.calcBaseRate({
			label: 'Soundcheck first 4h',
			baseRate: r.rehBaseFee,
			baseHrs: r.rehBaseHrs,
		})

		if (Request.rehDur > r.rehBaseHrs) {
			Request.calcAddHrs({
				label: 'Soundcheck Addtl. hrs',
				qty: Math.ceil(Request.rehDur, r.rehBaseHrs),
			})
		}

		// Dark Days
		if (Request.numDD) {
			Request.calc({
				label: 'Dark Days (NOT AVAILABLE)',
				description: 'Using rehearsal rate x 24h as a worst case scenario. I recommend contacting them about the actual rates.',
				qty: Request.numDD,
				rate: 5400
			})
		}

		Request.calc({
			qty: 1,
			label: 'Cleaning Fee',
			description: "Y'all dirty little children :>",
			rate: 100
		})

		const _crewDur = (Request.dur > 4 ? Request.dur : 4) +
			(Request.rehDur > 4 ? Request.rehDur : 4)
		const _crewHrs = _crewDur > 4 ? _crewDur : 4

		// Helpers
		Request.calcManHr({
			label: 'Technicians',
			description: 'Minimum 2 required by SCH',
			hrs: _crewHrs,
			pax: 2,
			rate: 25
		})

		Request.calcManHr({
			label: 'Production Crew',
			description: 'Minimum 3 required by SCH',
			hrs: _crewHrs,
			pax: 3,
			rate: 20
		})

		if (Request.numTC > 5) {
			Request.calcManHr({
				label: 'Tech/Prod Crew (additional)',
				description: 'Using technicians rate. If you\'d like production crew instead, deduct $5 per pax per hour',
				pax: Request.numTC - 5,
				hrs: _crewHrs,
				rate: 25
			})
		}

		Request.calcManHr({
			label: 'Ushers',
			description: '9 ushers free',
			pax: 9,
			hrs: Request.rehDur + 1,
			rate: 0
		})
	}
}