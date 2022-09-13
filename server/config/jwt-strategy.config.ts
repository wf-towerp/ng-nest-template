export const JWTConfig = {
    secret: process.env['APP_JWT_SECRET'],
    expiresIn: process.env['APP_JWT_EXPIRES'],
    expiresInRememberMe: process.env['APP_JWT_EXPIRES_REMEMBER_ME'],
};

export const APIKeyConfig = {};
