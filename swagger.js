const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Students API for EgorD',
        description: 'Drum lessons info',
    },
    host: 'students-api-doron.onrender.com', 
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
const endpointsFiles = ['./routes/auth.js', './routes/students.js']; 

swaggerAutogen(outputFile, endpointsFiles, doc);