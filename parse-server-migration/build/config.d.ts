declare const _default: Readonly<{
    MORALIS_API_KEY: string;
    DATABASE_URI: string;
    CLOUD_PATH: string;
    APPLICATION_ID: string;
    APP_NAME: string;
    MASTER_KEY: string;
    SERVER_URL: string;
    SERVER_ENDPOINT: string;
    PORT: number;
    REDIS_CONNECTION_STRING: string;
    ALLOW_INSECURE_HTTP: string;
    RATE_LIMIT_TTL: number;
    RATE_LIMIT_AUTHENTICATED: number;
    RATE_LIMIT_ANONYMOUS: number;
    USE_STREAMS: boolean;
    STREAMS_WEBHOOK_URL: string;
} & import("envalid").CleanedEnvAccessors>;
export default _default;
