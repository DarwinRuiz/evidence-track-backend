import jwt from 'jsonwebtoken';
import { appEnvironment } from '../../config/env';

export interface JwtPayload {
    userId: number;
    emailAddress: string;
    roleName: string;
}

export const jwtSecurity = {
    signAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, appEnvironment.jwtSecret, {
            algorithm: 'HS256',
            expiresIn: appEnvironment.jwtExpiration,
        });
    },

    verifyAccessToken(token: string): JwtPayload {
        const decoded = jwt.verify(token, appEnvironment.jwtSecret, {
            algorithms: ['HS256'],
        });
        return decoded as JwtPayload;
    },
};
