/* global server */
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import mockdate from 'mockdate'
mockdate.set(0)
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

beforeEach(async () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
  global.server = await init();
});

afterAll(async () => {
  await server.stop();
});
