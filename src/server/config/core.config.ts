import { join } from 'path';

export const STATIC_UPLOADS_PATH = join(__dirname, '..', 'public');
export const STATIC_VIEWS_PATH = join(__dirname, '..', 'browser');
export const DEFAULT_CACHE_EXPIRATION_TIME = 60000; /* 60 seconds */
