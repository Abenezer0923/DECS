import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DECS API',
      version: '1.0.0',
      description: 'API for Digital Election Calendar System',
    },
    servers: [
      { url: 'http://localhost:3000/api/v1' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to files containing annotations
};

export const swaggerSpec = swaggerJSDoc(options);
