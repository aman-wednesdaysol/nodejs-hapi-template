/* global server */
import mockdate from 'mockdate'
mockdate.set(0)
import { mockDB } from '@utils/testUtils';
import { ONE_USER_DATA } from '@utils/constants';
import { init } from './lib/testServer';

jest.mock('@analytics/client', () => ({
  __esModule: true,
  default: { capture: jest.fn(), shutdown: jest.fn() },
  shutdownAnalytics: jest.fn(),
}));

jest.mock('@analytics/tracker', () => ({
  trackLogin: jest.fn(),
  trackSignup: jest.fn(),
  trackLogout: jest.fn(),
  trackSongSearched: jest.fn(),
  trackSongLiked: jest.fn(),
  trackSongUnliked: jest.fn(),
  trackLibraryViewed: jest.fn(),
}));

require('jest-extended');

mockDB();

beforeEach(async () => {
  global.server = await init();
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
});

beforeAll(() => {
  jest.doMock('@root/server', () => ({
    server: {
      ...server,
      methods: {
        findOneUser: (id) => {
          if (id === '1') {
            return new Promise((resolve) => resolve(ONE_USER_DATA));
          }
          return new Promise((resolve) => resolve(null));
        },
      },
    },
  }));
});

afterAll(async () => {
  await server.stop();
});
