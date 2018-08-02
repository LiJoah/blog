const constants = {
  NODE_ENV: process.env.NODE_ENV === "prod" ? "prod" : "dev"
};

module.exports = constants;
