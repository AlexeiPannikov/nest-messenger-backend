import * as jwt from 'jsonwebtoken';
import {Injectable} from '@nestjs/common';
import {ITokenService} from './interface/ITokenService';
import {GenerateTokensPayloadDto} from "./dto/GenerateTokensPayload.dto";
import * as process from "process";

@Injectable()
export class TokenService implements ITokenService {
    constructor() {
    }

    generateTokens(payload: GenerateTokensPayloadDto) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '30m',
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '24h',
        });
        return {
            accessToken,
            refreshToken,
        };
    }

    validateRefreshToken(token: string): GenerateTokensPayloadDto {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as GenerateTokensPayloadDto
        } catch {
            return null
        }
    }

    validateAccessToken(token: string): GenerateTokensPayloadDto {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET) as GenerateTokensPayloadDto
        } catch {
            return null
        }
    }
}
