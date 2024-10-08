/** @type {import("drizzle-kit").Config} */

export default {
    schema: "./utils/schema.js",
    dialect: "postgresql",
    dbCredentials: {
        url: 'postgresql://ai%20mock%20interview_owner:Ou6WhkLlURE1@ep-bitter-sun-a5x45kay.us-east-2.aws.neon.tech/ai%20mock%20interview?sslmode=require '
    }
};