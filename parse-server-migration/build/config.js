"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const envalid_1 = require("envalid");
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
exports.default = (0, envalid_1.cleanEnv)(process.env, {
    MORALIS_API_KEY: (0, envalid_1.str)({
        desc: MORALIS_API_KEY,
    }),
    DATABASE_URI: (0, envalid_1.str)({
        desc: DATABASE_URI,
        devDefault: 'mongodb://localhost:27017',
    }),
    CLOUD_PATH: (0, envalid_1.str)({
        desc: CLOUD_PATH,
        default: './src/cloud/main.ts',
    }),
    APPLICATION_ID: (0, envalid_1.str)({
        desc: APPLICATION_ID,
        default: 'APPLICATION_ID',
    }),
    APP_NAME: (0, envalid_1.str)({
        desc: APP_NAME,
        devDefault: 'Demo App',
    }),
    MASTER_KEY: (0, envalid_1.str)({
        desc: MASTER_KEY,
    }),
    SERVER_URL: (0, envalid_1.str)({
        desc: SERVER_URL,
        devDefault: 'http://localhost:1337/server',
    }),
    SERVER_ENDPOINT: (0, envalid_1.str)({
        desc: SERVER_ENDPOINT,
        devDefault: 'server',
    }),
    PORT: (0, envalid_1.num)({
        desc: 'Default port wher parse-server will run on',
        default: 1337,
    }),
    REDIS_CONNECTION_STRING: (0, envalid_1.str)({
        desc: REDIS_CONNECTION_STRING,
        devDefault: 'redis://127.0.0.1:6379',
    }),
    ALLOW_INSECURE_HTTP: (0, envalid_1.str)({
        desc: ALLOW_INSECURE_HTTP,
        devDefault: 'true',
    }),
    RATE_LIMIT_TTL: (0, envalid_1.num)({
        desc: 'Rate limit window in seconds',
        default: 30,
    }),
    RATE_LIMIT_AUTHENTICATED: (0, envalid_1.num)({
        desc: 'Rate limit requests per window for authenticated users',
        default: 50,
    }),
    RATE_LIMIT_ANONYMOUS: (0, envalid_1.num)({
        desc: 'Rate limit requests per window for anonymous users',
        default: 20,
    }),
    USE_STREAMS: (0, envalid_1.bool)({
        desc: 'Enable streams sync',
        default: false,
    }),
    STREAMS_WEBHOOK_URL: (0, envalid_1.str)({
        desc: 'Webhook url for streams sync',
        default: '/streams-webhook',
    }),
});
//# sourceMappingURL=config.js.map