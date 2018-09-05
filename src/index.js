const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/reportingServer-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      timestamp: tsFormat,
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '15d',
      prepend: true,
      level: env === 'development' ? 'verbose' : 'info'
    })
  ]
});

export function logError(file, method, sessionId, requestId, message) {
  logger.error({
    file: file,
    method: method,
    sessionId: sessionId,
    requestId: requestId,
    message: message
  });
}

export function logInfo(file, method, sessionId, requestId, message) {
  logger.info({
    file: file,
    method: method,
    sessionId: sessionId,
    requestId: requestId,
    message: message
  });
}

export function logVerbose(file, method, sessionId, requestId, message) {
  logger.verbose({
    file: file,
    method: method,
    sessionId: sessionId,
    requestId: requestId,
    message: message
  });
}
