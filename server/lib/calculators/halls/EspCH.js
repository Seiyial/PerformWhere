module.exports = {
	info: {
		name: 'Esplanade Concert Hall',
		location: 'CBD',
		seating: 'Seats 1630 + 197 (Gallery)',
		docChecked: '2 Apr 2019'
	},
	calculateFees: (Request) => {
		// 1. Concert Hall Rate
		const ratesByType = {
			'p-arts': {
				perfBaseFee: [5800.00, 'If 18% of first $100k sales + 15% of subsequent sales exceeds $5.8k, it will cost that instead of $5.8k.'],
				perfBaseHrs: 4.5,
				perfAddHr: 900.00,
				peakSurcharge: 1000.00,
				peakDays: ['Friday', 'Saturday', 'PH Eve'],
				rehBaseFee: 1400.00,
				rehBaseHrs: 4,
				rehAddHr: 390.00,
				rehPeakSurcharge: 600.00,
				darkDayRate: 1700.00
			},
			'np-arts': {
				perfBaseFee: [3400.00, 'If 18% of first $100k sales + 15% of subsequent sales exceeds $3.4k, it will cost that instead of $3.4k.'],
				perfBaseHrs: 4.5,
				perfAddHr: 700.00,
				peakSurcharge: 1000.00,
				peakDays: ['Friday', 'Saturday', 'PH Eve'],
				rehBaseFee: 1400.00,
				rehBaseHrs: 4,
				rehAddHr: 390.00,
				rehPeakSurcharge: 600.00,
				darkDayRate: 1700.00
			},
			'fundraising': {
				perfBaseFee: [6000.00, 'flat fee'],
				perfBaseHrs: 4.5,
				perfAddHr: 900.00,
				peakSurcharge: 1000.00,
				peakDays: ['Friday', 'Saturday', 'PH Eve'],
				rehBaseFee: 1700.00,
				rehBaseHrs: 4,
				rehAddHr: 450.00,
				rehPeakSurcharge: 600.00,
				darkDayRate: 1700.00
			},
			'private': {
				perfBaseFee: [9000.00, 'If ticketed, will take 18% of box office sales instead of $9000 if it exceeds $9000'],
				perfBaseHrs: 4.5,
				perfAddHr: 2500.00,
				peakSurcharge: 1000.00,
				peakDays: ['Friday', 'Saturday', 'PH Eve'],
				rehBaseFee: 9000.00,
				rehBaseHrs: 4,
				rehAddHr: 2350.00,
				rehPeakSurcharge: 1000.00,
				darkDayRate: 0
			}
		}

		// fixed rates
		const fr = {
			techCrewPerPaxPerHr: [23.00, 'Extra 10/pax/hr if event is 12am to 8am'],
			techCrewMinHr: 4,
			usherFreeNum: 16,
			usherAddManHr: 13,
		}

		// varying rates
		const r = ratesByType[Request.evType]
		
		// Base Rate
		Request.calcBaseRate({
			label: 'Concert',
			description: r.perfBaseFee[1],
			baseRate: r.perfBaseFee[0],
			baseHrs: r.perfBaseHrs,
		})

		// Additional Hours
		if (Request.dur > r.perfBaseHrs) {
			Request.calcAddHrs({
				label: 'Concert (Additional)',
				description: 'Additional per hour or part thereof',
				qty: Math.ceil(Request.dur - r.perfBaseHrs),
				rate: r.perfAddHr
			})
		}

		// Peak Surcharge
		if (Request.isPeak(r.peakDays)) {
			Request.calcPeakSurcharge({
				label: 'Concert',
				peakDays: r.peakDays,
				rate: r.peakSurcharge
			})
		}

		// Rehearsal Base Rate
		Request.calcBaseRate({
			label: 'Rehearsal',
			// description: r.rehBaseFee,
			baseRate: r.rehBaseFee,
			baseHrs: r.rehBaseHrs,
		})

		// Add Hrs
		if (Request.rehDur > r.rehBaseHrs) {
			Request.calcAddHrs({
				label: 'Rehearsal',
				description: 'Additional per hour or part thereof',
				qty: Math.ceil(Request.rehDur - r.rehBaseHrs),
				rate: r.rehAddHr
			})
		}

		// Peak Surcharge
		if (Request.isPeak(r.peakDays)) {
			Request.calcPeakSurcharge({
				label: 'Rehearsal',
				description: r.peakDays.join(', '),
				rate: r.rehPeakSurcharge
			})
		}

		// Dark Days
		if (Request.evType !== 'private' && Request.numDD > 0) {
			Request.calc({
				label: 'Dark Day Rate',
				qty: Request.numDD,
				rate: r.darkDayRate
			})
		}

		const _crewDur = (Request.dur > 4 ? Request.dur : 4) +
			(Request.rehDur > 4 ? Request.rehDur : 4)

		// Tech Crew
		Request.calcManHr({
			label: 'Technical Crew',
			description: fr.techCrewPerPaxPerHr[1],
			rate: fr.techCrewPerPaxPerHr[0],
			pax: Request.numTC,
			hrs: _crewDur
		})

		// Ushers
		Request.calcManHr({
			label: 'Ushers',
			description: `First ${fr.usherFreeNum} free`,
			pax: fr.usherFreeNum,
			hrs: (Request.dur > 5 ? Request.dur : 5),
			rate: 0
		})

		if (Request.numUsh > fr.usherFreeNum) {
			Request.calcManHr({
				label: 'Additional Ushers',
				pax: (Request.numUsh - fr.usherFreeNum),
				hrs: (Request.dur > 5 ? Request.dur : 5),
				rate: fr.usherAddManHr
			})
		}
	}
}