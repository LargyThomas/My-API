const swaggerJsdoc = require('swagger-jsdoc');

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Animal Shelter API',
			version: '1.0.0',
			description: "API des données du refuge animalier d'Austin"
		},
		servers: [
			{ url: 'https://animal-shelter-api-yytb.onrender.com', description: 'Production' },
			{ url: 'http://localhost:3000', description: 'Local' }
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				}
			}
		}
	},
	apis: ['./src/features/**/*.js']
};

module.exports = swaggerJsdoc(options);