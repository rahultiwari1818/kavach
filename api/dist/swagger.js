import swaggerJSDoc from "swagger-jsdoc";
// Define your Swagger specification
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Kavach API",
        version: "1.0.0",
        description: "Kavach APIs Description",
    },
};
// Define options for swagger-jsdoc
const options = {
    swaggerDefinition,
    apis: ["./routes/*.ts", "./routes/*.js"], // ✅ Fixed here
};
// Generate Swagger spec
const swaggerSpec = swaggerJSDoc(options);
// Export as ES module
export default swaggerSpec;
//# sourceMappingURL=swagger.js.map