/*
	This service is responsible of running a scheudler tasks to fetch the latest price from the 3rd party service.
	Read more: https://cybermemos.com/developent/creating-moleculer-microservice-redis-caching/
	*/
"use strict";
const Cron = require("moleculer-cron");
let requestPromise = require('request-promise');

let APII_KEY = "REPLACE THIS WITH YOUR API KEY FROM free.currconv.com";
let CURRENCY_PAIR = "USD_AUD,USD_CAD";

let CURRENCY_API_URI = `https://free.currconv.com/api/v7/convert?q=${CURRENCY_PAIR}&compact=ultra&apiKey=${APII_KEY}`;

module.exports = {
	name: "priceFetch",

	mixins: [Cron],

	crons: [
		{
			name: "FetchPriceFromAPI",
			cronTime: '* * * * *',
			onTick: function () {

				console.log('FetchPriceFromAPI executed');
				let THIS = this;

				requestPromise(CURRENCY_API_URI)
					.then(function (response) {
						if (response != undefined) {
							console.log(response);

							// Save the response to cache using the service : persistence
							THIS.getLocalService("persistence")
								.actions.toCache({ data: JSON.parse(response) });
						} else {
							console.log("Error : empty response.")
						}
					})
					.catch(function (err) {
						console.log("Error : " + err)
					});
			},
			runOnInit: function () {
				console.log("FetchPriceFromAPI is created");
			},
			timeZone: 'America/Nipigon'
		}
	]
};