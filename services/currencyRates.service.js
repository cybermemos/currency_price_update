/*
	This service is responsible of fetching the price details from the Redis cache.
	Read more: https://cybermemos.com/developent/creating-moleculer-microservice-redis-caching/
	*/

"use strict";

module.exports = {
	name: "currencyRates",

	actions: {
		// Action call with caching for 50 seconds to return the stored data.
		fetchPrice: {
			cache: {
				ttl: 50
			},
			handler(ctx) {
				return this.fetchPriceImpl();
			}
		}
	},

	methods: {

		// Calling the action : fromCache from the service: persistence to obtain the data from the Redis cache.
		fetchPriceImpl() {

			let responseAsJSON = {};
			let THIS = this;
			return new Promise((resolve, reject) => {

				THIS.broker.call("persistence.fromCache").then(dataFromCache => {
					if (dataFromCache != undefined) {
						responseAsJSON = JSON.parse(dataFromCache);
						// Modifying the response by adding extra information.
						responseAsJSON.ts = new Date();
						responseAsJSON.powedBy = "CyberMemos Demo."
					} else {
						responseAsJSON.status = "error."
					}
					resolve(responseAsJSON);
				})
			}
			);
		}
	},

};