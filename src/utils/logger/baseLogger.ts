import * as fs from "fs";
import * as path from "path";
import { __DEV__ } from "../../config";
const pino = require("pino");
const LOG_DIR = "../../../logs";
export interface Logger {
  info(...message: any): void;
  error(...message: any): void;
  warn(...message: any): void;
  debug(...message: any): void;
  fatal(...message: any): void;
  trace(...message: any): void;
}

export enum LOG_LEVEL {
  INFO = 0,
  DEBUG = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
  TRACE = 5,
}

/**
 * @class
 * @description 
 */
class InternalLogger implements Logger {
  private readonly _logdir: string = path.resolve(__dirname, LOG_DIR);
  private errorLogDir: string;
  private infoLogDir: string;
  private warnLogDir: string;
  private traceLogDir: string;
  private debugLogDir: string;
  private fatalLogDir: string;
  private LOGGER?: Logger;

  constructor() {
    this.errorLogDir = path.resolve(this._logdir, "error.log");
    this.infoLogDir = path.resolve(this._logdir, "info.log");
    this.warnLogDir = path.resolve(this._logdir, "warn.log");
    this.traceLogDir = path.resolve(this._logdir, "trace.log");
    this.debugLogDir = path.resolve(this._logdir, "debug.log");
    this.fatalLogDir = path.resolve(this._logdir, "fatal.log");

    this.checkoutDirs();
    this.init();
  }

  checkoutDirs() {
    const isDirExists = fs.existsSync(this._logdir);

    if (!isDirExists) {
      fs.mkdirSync(this._logdir);
    }
  }

  init() {
    const transporter = pino.transport({
      targets: [
        {
          level: "error",
          target: "pino/file",
          options: {
            destination: this.errorLogDir,
            ignore: "hostname",
            singleLine: true,
          },
        },
        {
          level: "warn",
          target: "pino/file",
          options: {
            destination: this.warnLogDir,
            ignore: "hostname",
            singleLine: true,
          },
        },
        {
          level: "info",
          target: "pino/file",
          options: {
            destination: this.infoLogDir,
            ignore: "hostname",
            singleLine: true,
          },
        },
        {
          level: "trace",
          target: "pino/file",
          options: {
            destination: this.traceLogDir,
            singleLine: true,
            ignore: "hostname",
          },
        },
        {
          level: "fatal",
          target: "pino/file",
          options: {
            destination: this.fatalLogDir,
            singleLine: true,
            ignore: "hostname",
          },
        },
        {
          level: "debug",
          target: "pino/file",
          options: {
            destination: this.debugLogDir,
            singleLine: true,
            ignore: "hostname",
          },
        },
        {
          target: "pino-pretty",
          options: {
            colorize: true,
            singleLine: true,
            ignore: "hostname",
          },
        },
      ],
    });
    this.LOGGER = pino(transporter);
  }

  info(..._message: any) {
    this.LOGGER?.info(_message);
  }
  error(..._message: any) {
    this.LOGGER?.error(_message);
  }
  warn(..._message: any) {
    this.LOGGER?.warn(_message);
  }
  debug(..._message: any) {
    this.LOGGER?.debug(_message);
  }
  fatal(..._message: any) {
    this.LOGGER?.fatal(_message);
  }
  trace(..._message: any) {
    this.LOGGER?.trace(_message);
  }
}

const logger = new InternalLogger();

class MainLogger {
  private _level: LOG_LEVEL;
  private _logger: Logger;
  private _context: string;

  constructor(context: string, level: LOG_LEVEL) {
    this._level = level;
    this._logger = logger;
    this._context = context;
  }

  info(message: any) {
    if (this._level <= LOG_LEVEL.INFO) {
      this._logger.info({ message, context: this._context });
    }
  }

  error(message: any) {
    if (this._level <= LOG_LEVEL.ERROR) {
      this._logger.error({ message, context: this._context });
    }
  }

  warn(message: any) {
    if (this._level <= LOG_LEVEL.WARN) {
      this._logger.warn({ message, context: this._context });
    }
  }

  debug(message: any) {
    if (this._level <= LOG_LEVEL.DEBUG) {
      this._logger.debug({ message, context: this._context });
    }
  }

  trace(message: any) {
    if (this._level <= LOG_LEVEL.TRACE) {
      this._logger.trace({ message, context: this._context });
    }
  }

  fatal(message: any) {
    if (this._level <= LOG_LEVEL.FATAL) {
      this._logger.fatal({ message, context: this._context });
    }
  }
}

export function createLogger(context: string, isDev: boolean = false): Logger {
  if (__DEV__ || isDev) {
    return logger;
  }
  const mainLogger = new MainLogger(context, LOG_LEVEL.DEBUG);
  return mainLogger;
}
