const { createLogger } = require("logger");

const logger = createLogger();
logger.write = (message) => process.stdout.write(message);

module.exports = logger;
