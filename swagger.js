import swaggerJSDoc from "swagger-jsdoc";

const getSwaggerOptions = (req) => {
  const serverUrl = `${req.protocol}://${req.get("host")}`;

  return {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Backend API Documentation",
        version: "1.0.0",
        description: "Documentation for the MHK web3 backend API",
      },
      servers: [
        {
          url: serverUrl,
          description: "Server provided by eth ENS",
        },
      ],
    },
    apis: ["./routes/**/*.js"],
  };
};
const swaggerSpecs = (req) => {
  return swaggerJSDoc(getSwaggerOptions(req));
};
export default swaggerSpecs;
