import { createLogger as wcl, format, transports } from "winston"
import DailyRotateFile from "winston-daily-rotate-file"
import { NAME } from "./env"

const commonOptions = {
  maxFiles: 60,
  dirname: "logs",
  extension: ".log",
}

const justErrors = new DailyRotateFile({ filename: `${NAME}-error-%DATE%`, level: "error", ...commonOptions })

const robustLog = new DailyRotateFile({
  filename: `${NAME}-%DATE%`,
  level: process.env.WINSTON_LOG_LEVEL ? process.env.WINSTON_LOG_LEVEL : "debug",
  ...commonOptions,
})

// Attach to rotation events to push to safe/cloud storage (e.g. S3 or azure)
robustLog.on("rotate", (oldf, newf) => {
  // ...
})

export const logger = wcl({
  level: "info",
  //format: winston.format.json(),
  format: format.combine(format.splat(), format.simple()),
  defaultMeta: { service: NAME },
  transports: [justErrors, robustLog],
  exitOnError: false,
})

/** Create a child logger from the root logger. */
export function createChildLogger(name: string) {
  return logger.child({
    service: `${NAME}.${name}`,
  })
}

//
// LOG_CONSOLE always turns on cosole logging :-)
//
if (process.env.NODE_ENV !== "production" || process.env.LOG_CONSOLE !== undefined) {
  logger.add(
    new transports.Console({
      level: "debug",
      format: format.combine(format.colorize(), format.simple()),
    })
  )
}
