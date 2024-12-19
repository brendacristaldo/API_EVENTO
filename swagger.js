const swaggerAutogen = require("swagger-autogen")();
output = "./swagger_doc.json";
(endpoints = [
    "./routes/adminRota.js",
    "./routes/loginRota.js",
    "./routes/perfilRota.js",
    "./routes/usuarioExcluirRota.js",
    
  ]),

swaggerAutogen(output, endpoints);