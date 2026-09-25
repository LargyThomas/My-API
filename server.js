require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const port = 3000;

const app = require('./src/app');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});