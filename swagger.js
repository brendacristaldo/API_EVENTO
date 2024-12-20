const swaggerAutogen = require("swagger-autogen")();
output = "./swagger_doc.json";
(endpoints = [
  './src/routes/*.js'
  ]),

swaggerAutogen(output, endpoints);