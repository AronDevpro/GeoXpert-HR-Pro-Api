import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 3003,
    dbURI: process.env.DB_URI,
    secretKey: process.env.SECRET_KEY
};

export default config;