import { v4 as uuidv4 } from 'uuid';
import {
  TIMESTAMP,
} from '@utils/constants';
import { createLogger, format, transports } from 'winston';
import rTracer from 'cls-rtracer';

const { combine, timestamp, printf } = format;

export const formatWithTimestamp = (date) =>
  date ? date.format(TIMESTAMP) : null;

export const strippedUUID = () => uuidv4().replace(/-/g, '');

export const isTestEnv = () =>
  process.env.ENVIRONMENT_NAME === 'test' || process.env.NODE_ENV === 'test';
export const isLocalEnv = () => process.env.ENVIRONMENT_NAME === 'local';


export const stringifyWithCheck = (message) => {
  if (!message) {
    return '';
  }

  try {
    return JSON.stringify(message);
  } catch (err) {
    if (message.data) {
      return stringifyWithCheck(message.data);
    }
    console.log({message});
    return `unable to unfurl message: ${message}`;
  }
};

export const logger = () => {
  const rTracerFormat = printf((info) => {
    const rid = rTracer.id();
    // @ts-ignore
    const infoSplat = info[Symbol.for('splat')] || [];

    let message = `${info.timestamp}: ${stringifyWithCheck(
      info.message
    )} ${stringifyWithCheck(...infoSplat)}`;
    if (rid) {
      message = `[request-id:${rid}]: ${message}`
    }
    return message
  });
  return createLogger({
    format: combine(timestamp(), rTracerFormat),
    transports: [new transports.Console()],
  });
};

export const getLogger = () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    return console.log;
  }
  if (process.env.NODE_ENV === 'test') {
    return false;
  }
  return (args) => logger().info(args);
};
