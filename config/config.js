require("dotenv").config();

module.exports = {
	development: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
	},
	test: {
		username: "root",
		password: null,
		database: "database_test",
		host: "127.0.0.1",
		dialect: "mysql",
	},
	production: {
		username: "gvskywpwmkjbti",
		password: "ad1f6244e021b784c1cf2fc7b5f83868a764ad54d3a990010b155fae7ef49287",
		database: "ddagrb67no6bk4",
		host: "ec2-34-226-179-89.compute-1.amazonaws.com",
		dialect: "postgres",
		"port": 5432,
		"dialectOptions": {
			"ssl": {
			  "rejectUnauthorized": false
			}
		  }
	},
};
