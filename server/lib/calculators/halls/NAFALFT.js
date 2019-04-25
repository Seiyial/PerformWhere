module.exports = {
	info: {
		name: 'NAFA Lee Foundation Theatre',
		location: 'CBD',
		seating: 'Seats 380',
		externalDocUrl: 'https://www.nafa.edu.sg/about-nafa/campus/facilities-for-rent#collapseOne',
		extraInfo: 'Piano available at $450 (Yamaha C3) or $650 (Steinway D) per day, Orch riser available at $100 each, projector 300, microphone in addition to 2 is 50 each.'
	},
	calculateFees: (Request) => {
		const ratesByType = {
			'p-arts': {
				perfBaseFee: [1800.00, ''],
				perfBaseHrs: 4,
				perfAddHr: 450.00,
				peakSurcharge: 200.00,
				peakDays: ['Friday', 'Saturday', 'Sunday', 'PH', 'PH Eve'],
				rehBaseFee: 800.00,
				rehBaseHrs: 4,
				rehAddHr: 200.00,
				rehPeakSurcharge: 200.00,
				darkDayRate: 0.00
			},
			'np-arts': {
				perfBaseFee: [1400.00, 'DISCLAIMER: NAFA requires proof that you are an active & REGISTERED non-profit arts/charity organisation.'],
				perfBaseHrs: 4,
				perfAddHr: 350.00,
				peakSurcharge: 200.00,
				peakDays: ['Friday', 'Saturday', 'Sunday', 'PH', 'PH Eve'],
				rehBaseFee: 600.00, // Note: Rehearsal is OPTIONAL
				rehBaseHrs: 4,
				rehAddHr: 150.00,
				rehPeakSurcharge: 500.00,
				darkDayRate: 0.00
			}
		}

		const r = ratesByType[Request.evType]

		// Base Rate
		Request.calcBaseRate({
			label: 'Concert first 4h',
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
			description: 'ADDITIONAL ' + r.rehPeakSurcharge + 'applies if rehearsal is Not on same day of performance',
			rate: r.peakSurcharge,
			onlyIfPeakTypes: r.peakDays
		})

		// Rehearsal
		Request.calcBaseRate({
			label: 'Soundcheck (Optional) first 4h',
			description: '"Note: The 4-hour block (0900-1300; 1400-1800; 1900-2300) is inclusive of Load-in/Props & Technical Set-up/Bump-out time. All items, including props and equipment, brought in by the Hirer or/and Hirer’s contractors, have to be dismantled and removed from the premises before the ending time of hire."',
			baseRate: r.rehBaseFee,
			baseHrs: r.rehBaseHrs
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
				label: 'Dark Days (Rate N/A)',
				description: 'NAFA LFT has no info on Dark Days. I\'m guessing this means you may need to pay it all at rehearsal rate. I recommend you ask NAFA on this.',
				rate: 4800,
				qty: Request.numDD
			})
		}

		// NAFA has slightly more complicated rules on Crew
		const _crewDur = Request.dur + Request.rehDur
		const _crewHrs = _crewDur > 4 ? _crewDur : 4

		let _wkDayTechCrewNote = '',
			_rate
		if (Request.isPeak(['Saturday', 'Sunday', 'PH', 'PH Eve'])) {
			_rate = 35
		} else {
			_rate = 30
			_wkDayTechCrewNote = ' IF your event is 0900-1800hrs on non-PH/eve weekdays, 2 technical staff are FOC.'
		}

		// Helpers
		Request.calcManHr({
			label: 'Technical Crew',
			description: 'NAFALFT requires min. 3 in-house tech staff to be there during setup, rehearsals & performances. They are chargeable.' + _wkDayTechCrewNote,
			hrs: _crewHrs,
			pax: Request.numTC > 3 ? Request.numTC : 3,
			rate: _rate
		})

		Request.calc({
			label: 'Ushers (N/A)',
			description: "For NAFA LFT, ushers weren't on the hiring rates listing.",
			qty: 0,
			rate: 0
		})
	}
}