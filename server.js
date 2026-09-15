require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = require('./src/app');
const port = 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});