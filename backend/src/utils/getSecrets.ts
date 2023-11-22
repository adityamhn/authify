require("dotenv").config();

const defaultConfig: any = {
  MONGO_URI: "mongodb://127.0.0.1:27017/authify",
  SESS_NAME: "rsid",
  SESS_SECRET: "thisismysessionsecret!123",
  DEPLOYMENT: "LOCAL",
  FRONTEND_URL: "http://127.0.0.1:3000",
  PORT: 8080,
};

const getSecrets = async (key: string) => {
  let secret = process.env[key] ? process.env[key] : defaultConfig[key];

  if (!secret) {
    throw new Error(`Missing secret ${key}`);
  }

  return secret;
};

export default getSecrets;
