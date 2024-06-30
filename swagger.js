const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Students API for EgorD',
        description: 'Drum lessons info',
    },
    host: 'https://egordrums.onrender.com/', 
    schemes: ['https'],
    securityDefinitions: {
        Bearer: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Enter your bearer token in the format **Bearer &lt;token&gt;**',
        }
    }
};

const outputFile = './swagger-output.json'; 
const endpointsFiles = ['./routes/sessionRoutes.js', './routes/students.js', './routes/lessons.js','./routes/aboutRouter.js','./routes/contactRouter.js']; 

swaggerAutogen(outputFile, endpointsFiles, doc);