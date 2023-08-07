import * as dotenv from 'dotenv';
import { cleanEnv, num, str, bool } from 'envalid';

dotenv.config();

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const DATABASE_URI = process.env.DATABASE_URI;
const CLOUD_PATH = process.env.CLOUD_PATH;
const APPLICATION_ID = process.env.APPLICATION_ID;
const APP_NAME = process.env.APP_NAME;
const MASTER_KEY = process.env.MASTER_KEY;
const SERVER_URL = process.env.SERVER_URL;
const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT;
const REDIS_CONNECTION_STRING = process.env.REDIS_CONNECTION_STRING;
const ALLOW_INSECURE_HTTP = process.env.ALLOW_INSECURE_HTTP;

export default cleanEnv(process.env, {
  MORALIS_API_KEY: str({
    desc: MORALIS_API_KEY,
  }),
  DATABASE_URI: str({
    desc: DATABASE_URI,
    devDefault: 'mongodb://localhost:27017',
  }),
  CLOUD_PATH: str({
    desc: CLOUD_PATH,
    default: './src/cloud/main.ts',
  }),
  APPLICATION_ID: str({
    desc: APPLICATION_ID,
    default: 'APPLICATION_ID',
  }),
  APP_NAME: str({
    desc: APP_NAME,
    devDefault: 'Demo App',
  }),
  MASTER_KEY: str({
    desc: MASTER_KEY,
  }),
  SERVER_URL: str({
    desc: SERVER_URL,
    devDefault: 'http://localhost:1337/server',
  }),
  SERVER_ENDPOINT: str({
    desc: SERVER_ENDPOINT,
    devDefault: 'server',
  }),
  PORT: num({
    desc: 'Default port wher parse-server will run on',
    default: 1337,
  }),
  REDIS_CONNECTION_STRING: str({
    desc: REDIS_CONNECTION_STRING,
    devDefault: 'redis://127.0.0.1:6379',
  }),
  ALLOW_INSECURE_HTTP: str({
    desc: ALLOW_INSECURE_HTTP,
    devDefault: 'true',
  }),
  RATE_LIMIT_TTL: num({
    desc: 'Rate limit window in seconds',
    default: 30,
  }),
  RATE_LIMIT_AUTHENTICATED: num({
    desc: 'Rate limit requests per window for authenticated users',
    default: 50,
  }),
  RATE_LIMIT_ANONYMOUS: num({
    desc: 'Rate limit requests per window for anonymous users',
    default: 20,
  }),
  USE_STREAMS: bool({
    desc: 'Enable streams sync',
    default: false,
  }),
  STREAMS_WEBHOOK_URL: str({
    desc: 'Webhook url for streams sync',
    default: '/streams-webhook',
  }),
});
