module.exports = {
	info: {
		name: 'Sg Chinese Cultural Ctr. (SCCC)',
		location: 'Tanjong Pagar',
		seating: 'SCCC Auditorium | Seats 5333',
		extraInfo: 'No Peak Surcharge. Yay. Piano available at 650/day, tuning at 250. cleaning & security inclusive, projection & 4 mics inclusive. Risers at 110/unit/day.'
	},
	calculateFees: (Request) => {
		const r = {
			perfBaseFee: [2500.00, ''],
			perfBaseHrs: 4,
			perfAddHr: 650.00,
			rehBaseFee: 1500.00,
			rehBaseHrs: 4,
			rehAddHr: 400.00,
			darkDayRate: 1500,
		}

		// Base Rate
		Request.calcBaseRate({
			label: 'Concert first 4h',
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
		Request.calc({
			label: 'Dark Days',
			qty: Request.numDD,
			rate: r.darkDayRate
		})

		const _crewDur = Request.dur + Request.rehDur
		const _crewHrs = _crewDur > 4 ? _crewDur : 4

		// Helpers
		Request.calcManHr({
			label: 'Technicians (3 free)',
			hrs: _crewHrs,
			pax: 3,
			rate: 0
		})

		Request.calcManHr({
			label: 'Ushers (8 free)',
			hrs: Request.dur + 1,
			pax: 8,
			rate: 0
		})

		if (Request.numTC > 3) {
			Request.calcManHr({
				label: 'Technicians (additional)',
				description: 'Add 10/pax/hr + 30 technician transport if technician work is between 11pm and 8am',
				pax: Request.numTC - 3,
				rate: 20
			})
		}

		if (Request.numUsh > 8) {
			Request.calcManHr({
				label: 'Ushers (additional)',
				pax: Request.numUsh - 8,
				rate: 20
			})
		}

		Request.calc({
			label: 'Orchestra Chairs ($15/unit)',
			description: "....................okay let's make a rough estimate that you have 60 performers, amend this accordingly",
			qty: 60,
			rate: 15
		})
	}
}