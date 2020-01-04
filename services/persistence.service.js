/*
	This service works as a dedecated worker used to save and obtain the data to/from Radis cache.
	Read more: https://cybermemos.com/developent/creating-moleculer-microservice-redis-caching/
	*/
"use strict";
// Add Redis client dependency
const redis = require("redis");

module.exports = {
	name: "persistence",

	redisClient: undefined,

	actions: {

		// Add an action call which will accept a data to be added to the cache.
		toCache: {
			params: {
				data: "object",
			},
			handler(ctx) {
				return this.saveDataToRedis(ctx.params.data);
			}
		},

		// Add an action call which will read the currency data from Redis cache.
		fromCache() {
			return this.readDataFromRedis();
		}
	},

	methods: {
		// Implementation of adding the data to the Redis cache. 
		saveDataToRedis(currencyDataToSave) {
			this.redisClient.set("CurrencyData", JSON.stringify(currencyDataToSave), function (err, res) {
				if (err) {
					console.log("Error while saving to Redis, ", err);
				} else {
					console.log("saving to Redis successful , ", res)
				}
			});
		},

		// Implementation of reading the data from the Redis cache. 
		readDataFromRedis() {
			return new Promise((resolve, reject) => {

				this.redisClient.get("CurrencyData", function (err, res) {
					if (err) {
						reject("Error while reading from Redis, ", err);
					} else {
						resolve(res);
					}
				});
			})

		}
	},

	// Initialise the Redis client and check for errors.
	started() {
		this.redisClient = redis.createClient();
		this.redisClient.on("error", function (err) {
			console.log("Error while connecting to Redis" + err);
			throw err;
		});
	},
};