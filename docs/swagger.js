const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '1.0.0',
            description: 'API documentation for Task Manager',
        },
        servers: [{ url: 'http://localhost:2025' }],
        components: {
            securitySchemes: {
                AuthToken: {
                    type: "apiKey",
                    in: "header",
                    name: "Authorization",
                    description: "Enter JWT token directly"
                }
            }
        },
        security: [{ AuthToken: [] }]
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            persistAuthorization: true,
        }
    }));
};

module.exports = setupSwagger;
