require("dotenv").config();

const getSecrets = async (key: string) => {
  const secret = process.env[key];

  if (!secret) {
    throw new Error(`Missing secret ${key}`);
  }

  return secret;
};

export default getSecrets;
