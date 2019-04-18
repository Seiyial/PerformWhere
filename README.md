# PerformWhere

Calculate the prices for using various Singapore concert halls for your symphony orchestra, or wind ensemble/band concert projects. Check it out at [performwhere.syx.li](https://performwhere.syx.li).



## Development

```bash
git clone https://github.com/Seiyial/PerformWhere.git PW
cd PW
yarn i # or npm run i
yarn start # or npm run start
```

## The PWRequest API

Calculators should use the `Request` object and its instance methods to tabulate concert hall fees. This is a detailed API which should contain everything you need. Feel free to add more features to the `PWRequest` class in your pull requests if you feel it is a good idea.

<h4 style="color: #0097a7"><code>Request</code> Object Attributes:</h4>

##### `Request.evType` (string)

The type of event the user requests. Takes one of the following values:-

 - `"np-arts"` - The user is checking fees for a **non-profit** arts event.
 - `"p-arts"` - The user is checking fees for a **for-profit** arts-event.

##### `Request.dur` (number)

User's desired **concert** duration in hours. E.g. `3` : 3 hours.

> If this is less than the Concert Hall's packaged minimum hours, the calculator should use the packaged minimum hours and inform the user accordingly. More below in `Request.calcBaseRate()`.

##### `Request.rehDur` (number)

User's desired **soundcheck** duration in hours.

> If this is less than the Concert Hall's packaged minimum hours, the calculator should use the packaged minimum hours and inform the user accordingly. More below in `Request.calcBaseRate()`.

##### `Request.isoDate` (string)

The user's desired date of the concert in ISO `yyyy-mm-dd` format.
Example values:

9 December 2019: `"2019-12-09"`

18 April 2020: `"2020-04-18"`

##### `Request.lxDate` (Luxon DateTime)

The same date as the above `Request.isoDate` but in the form of a [Luxon DateTime](https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html) object. Contains all you need to calculate (etc) the date. It shouldn't be required but feel free to `import` Luxon's other classes as well.

##### `Request.numDD` (number)

The number of dark days the user inputted (`0` if no input). A dark day is a an overnight where the concert hall is filled with the group's setups and thus unable to be used for other events (please take with a grain of salt and correct me if I'm wrong 😛).

##### `Request.numTC` (number)

Number of Tech Crew the user requested for.

##### `Request.numUsh` (number)

Number of Ushers the user requested for.

##### `Request.peakTypes` (array of strings)

An array containing the following possible values where applicable.

- Public Holidays
	- `"PH"` - denotes that the date lies on a Public Holiday.
	- `"PH Eve"` - denotes that the date lies on the eve of a Public Holiday.

- Day of the Week
	- `Monday`
	- `Tuesday`
	- `Wednesday`
	- `Thursday`
	- `Friday`
	- `Saturday`
	- `Sunday`

##### `Request.errors` (array of strings)

List of errors encountered in the calculation API _so far_.

To add an error, use `Request.recordError()` below.

##### `Request.results` (object)

List of results so far in the calculation API.

---

<h4 style="color: #0097a7"><code>Request</code> Object Instance Functions</h4>

##### `Request.calcBaseRate({ label = 'Base Rate', description, rate, baseHrs })`

Inserts a fee for the concert hall's base rate. This can be the base rate for the concert or soundcheck.

- `label` (string) - Recommended `"Concert"` or `"Soundcheck"`, to which the calculator will append `"Base Rate"`. Alternatively, input your own custom labelling to this fee altogether.
- `description` (string) (optional) - Additional text to display, like edge cases where if the box office revenue is more than XXXXX the concert hall would take 15% of that instead (applies for esplanade).
- `baseHrs` (number) - The number of hours the base fare covers, in dollars.
- `baseRate` (string) - the base fare itself.

##### `Request.calcAddHrs({ label = 'Additional Hrs', description, rate, qty })`

Inserts a fee for usage of the concert hall by an hourly rate.

- `label` (string) - Recommended `"Concert"` or `"Soundcheck"`, to which the calculator will append `"Additional Hrs"`. Alternatively, input your own custom labelling to this fee altogether.
- `description` (string) (optional) - Additional small text to display under the label.
- `rate` (number) - The cost per hour in dollars.
- `qty` (number) - The number of hours other than those covered by the base rate, e.g. `Request.rehDur - yourConcertHallBaseRehHours`.

##### `Request.isPeak(arrayOfSpecifiedPeaks)`

Checks if the requested date falls on any of the specified peaks. Returns `null` if it doesn't, otherwise a (truthy) array of the matched peaks.

Usage example:

```js
// I want to test if the user's date falls on a Public Holiday and/or Weekend.
if (Request.isPeak(['PH', 'Saturday', 'Sunday'])) {
	// ... if it falls on a PH, Saturday and/or Sunday
} else {
	// ... if it doesn't
}

// I want to test if the user's date falls on a Monday.
if (Request.isPeak(['Monday'])) {
	// ...
} else {
	// ...
}
```

Values you can specify and test for:
- `PH`: Public Holiday
- `PH Eve`: Eve of Public Holiday
- `Monday`
- `Tuesday`
- `Wednesday`
- `Thursday`
- `Friday`
- `Saturday`
- `Sunday`

Returns either:
- `[ ]` list of values you inputted that are also found in `Request.peakTypes`, or
- `null`.

##### `Request.calcPeakSurcharge({ label, description, rate, qty, onlyIfPeakTypes })

Inserts a fee object suited for peak surcharges.

- `label` (string) - Recommended `"Concert"` or `"Soundcheck"`, to which the calculator will append `"Peak Surcharge"`. Alternatively, input your own custom labelling to this fee altogether.
- `description` (string) (optional) - Additional small text to display under the label.
- `rate` (number) - The charge per unit of peak surcharge in dollars.
- `qty` (number) (optional) - The number of units of peak surcharge. Defaults to 1. If your concert hall charges peak surcharge as a flat rate, you need not input this parameter.
- `onlyIfPeakTypes` (array of strings) (optional)
	- If you do not specify this value, the peak surcharge will _definitely_ be tabulated and included in the concert hall fees.
	- If you specify this value, it will be passed into `Request.isPeak()` to check if the Request date is applicable for peak surcharge. Thus, similar to `Request.isPeak()`, you should pass in an array of peak types you'd like to check for. See `Request.isPeak()` for checkable peak types. Usage example:

	```js
		Request.calcPeakSurcharge({
			label: 'Concert',
			description: 'Applies to PH Eve, Fridays and Saturdays',
			rate: 500.00,
			onlyIfPeakTypes: ['PH Eve', 'Friday', 'Saturday'] // charge peak surcharge only if Request date is a PH Eve and/or Friday and/or Saturday
		})
	```
	
##### `Request.calcManHr({ label, description, hrs, pax, rate })`

Inserts a fee object suited for fees with 2 dimensions of quantity (variable qty of hours and variable qty of helpers), such as Ushers and Technical Crew.

- `label` (string) - Input a labelling to this fee (e.g. `"Ushers"`.)
- `description` (string) (optional) - Additional small text to display under the label.
- `pax` (number) - Number of ushers/technical crew.
- `hrs` (number) - Number of hours the ushers/technical crew would be hired for. For ushers, we can set that to be `(1 + Request.dur)` for example, if the ushers are required for the length of the concert and 1h before. For tech crew, we can set that to be `(Request.dur + Request.rehDur)` if we'd like the tech crew to be around for the whole rehearsal and concert.
- `rate` (number) - The cost of each helper per hour.



