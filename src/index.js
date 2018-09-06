const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = process.env.LOG_DIR || 'log';
const logFile = process.env.LOG_FILE || 'log';
var filePath = "";
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
            filename: `${logDir}/${logFile}-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            timestamp: tsFormat,
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '7d',
            prepend: true,
            level: env === 'development' ? 'verbose' : 'info'
        }),
        new (require('winston-daily-rotate-file'))({
            filename: `${logDir}/${logFile}-%DATE%.errors.log`,
            datePattern: 'YYYY-MM-DD',
            timestamp: tsFormat,
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '15d',
            prepend: true,
            level: env === 'error'
        })

    ]
});

function logError(method, sessionId, requestId, message) {
    logger.error({
        file: filePath,
        method: method,
        sessionId: sessionId,
        requestId: requestId,
        message: message
    });
}

function logInfo(method, sessionId, requestId, message) {
    logger.info({
        file: filePath,
        method: method,
        sessionId: sessionId,
        requestId: requestId,
        message: message
    });
}

function logVerbose(method, sessionId, requestId, message) {
    logger.verbose({
        file: filePath,
        method: method,
        sessionId: sessionId,
        requestId: requestId,
        message: message
    });
}

function init(file) {
    filePath = file
}

module.exports = {
    init: init,
    logInfo: logInfo,
    logError: logError,
    logVerbose: logVerbose
}
