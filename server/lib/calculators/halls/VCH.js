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
			},
			// 'fundraising': {
			// 	perfBaseFee: [856.00, 'flat fee'],
			// 	perfBaseHrs: 4.5,
			// 	perfAddHr: 214.00,
			// 	peakSurcharge: 214.00,
			// 	peakDays: ['Friday', 'Saturday', 'PH Eve'],
			// 	rehBaseFee: 535.00,
			// 	rehBaseHrs: 4,
			// 	rehAddHr: 160.50,
			// 	rehPeakSurcharge: 160.50,
			// 	darkDayRate: 1700.00
			// },
			// 'private': {
			// 	perfBaseFee: [1926.00, 'Incl. GST, or 18% of Box Office sales for ticketed events (subject to GST), whichever is higher'],
			// 	perfBaseHrs: 4.5,
			// 	perfAddHr: 561.75,
			// 	peakSurcharge: 1926.00,
			// 	peakDays: ['Friday', 'Saturday', 'PH Eve'],
			// 	rehBaseFee: 1926.00,
			// 	rehBaseHrs: 4,
			// 	rehAddHr: 561.75,
			// 	rehPeakSurcharge: 1926,
			// 	darkDayRate: 0
			// }
		}

		// fixed rates
		const fr = {
			techCrewPerPaxPerHr: [24.61, 'Extra $10.70/pax/hr if event is 12am to 8am'],
			techCrewMinHr: 4,
			usherFreeNum: 4,
			usherMinHr: 3,
			usherAddManHr: 13.91
		}

		return fees
	}
}