module.exports = {
	"properties": {
		"countryCode": {
			"description": "Your Country Code (ex. JP, US)",
			"pattern": /^\S+$/,
			"message": "Sorry, you cannot include white spaces.",
			"default": "JP"
		},
		"stateOrProvince": {
			"description": "Your State or Province (ex. Tokyo, NY)",
			"pattern": /^\S+$/,
			"message": "Sorry, you cannot include white spaces.",
			"default": "Tokyo"
		},
		"organization": {
			"description": "Your organization (ex. MyCompany, AdobeJapan)",
			"pattern": /^\S+$/,
			"message": "Sorry, you cannot include white spaces.",
			"default": "MyCompany"
		},
		"commonName": {
			"description": "Your Name. (ex. AndyHall, matsurai25)",
			"pattern": /^\S+$/,
			"message": "Sorry, you cannot include white spaces.",
			"required": true
		},
		"password": {
			"description": "password (This password is required again when export)",
			"pattern": /^\S+$/,
			"message": "Sorry, you cannot include white spaces.",
			"hidden": true,
			"replace": "*",
			"required": true
		}
	}
}
