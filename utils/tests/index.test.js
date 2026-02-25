import rTracer from 'cls-rtracer'
import moment from 'moment';
import {
  TIMESTAMP,
} from '@utils/constants';
import { logger, stringifyWithCheck } from '@utils';

describe('util tests', () => {
  describe('formatWithTimestamp', () => {
    it('should format the provided moment', () => {
      const now = moment();
      const nowFormatted = moment().format(TIMESTAMP);
      const { formatWithTimestamp } = require('@utils');
      const nowFormattedTest = formatWithTimestamp(now);
      expect(nowFormatted).toEqual(nowFormattedTest);
    });
  });

  describe('strippedUUID', () => {
    it('should return a uuid with no `-` ', () => {
      const { strippedUUID } = require('@utils');
      const uuId = strippedUUID();
      expect(uuId).toEqual(expect.not.stringMatching(/-/g));
    });
  });

  describe('getLogger', () => {
    it('should return console.log for env develop', () => {
      process.env = {
        NODE_ENV: 'development',
      };
      const { getLogger } = require('@utils');
      expect(getLogger()).toEqual(console.log);
    });

    it('should return false for env test', () => {
      process.env = {
        NODE_ENV: 'test',
      };
      const { getLogger } = require('@utils');
      expect(getLogger()).toEqual(false);
    });

    it('should return function type for any other env', () => {
      process.env = {
        NODE_ENV: 'prod',
      };
      const { getLogger } = require('@utils');
      expect(typeof getLogger()).toEqual('function');
    });
  });
});

describe('winston logger tests', () => {
  it('should run mocked winston test', () => {
    // @ts-ignore
    const spy = jest.spyOn(console._stdout, 'write');
    const message = 'this is the message';
    const argument = { arg: '1' };
    logger().info(message, argument);
    expect(spy).toBeCalledWith(
      `${moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')}: ${JSON.stringify(
        message
      )} ${JSON.stringify(argument)}
`
    );
  });

  it('should add request trace', () => {
    const id = 7;

    jest.spyOn(rTracer, 'id').mockImplementation(() => id);
    // @ts-ignore
    const spy = jest.spyOn(console._stdout, 'write');
    const message = 'this is the message';
    const argument = { arg: '1' };
    logger().info(message, argument);
    expect(spy).toBeCalledWith(
      `[request-id:${id}]: ${moment()
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')}: ${JSON.stringify(
        message
      )} ${JSON.stringify(argument)}
`
    );
  });
});

describe('stringifyWithCheck', () => {
  it('should return the strigified message', () => {
    const obj = { a: 'b' };
    const res = stringifyWithCheck(obj);
    expect(res).toBe(JSON.stringify(obj));
  });
  it('should not throw an error if its not able to stringify the object', () => {
    const obj = { a: 'b' };
    obj.obj = obj;
    const res = stringifyWithCheck(obj);
    expect(res).toBe('unable to unfurl message: [object Object]');
  });

  it('should stringify the data key if present in the message and unable to stringify the original value', () => {
    const obj = { a: 'b' };
    obj.obj = obj;
    obj.data = { body: 'This is the real answer' };
    const res = stringifyWithCheck(obj);
    expect(res).toBe(JSON.stringify(obj.data));
  });
});
