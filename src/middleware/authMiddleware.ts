import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequestService } from '../request.service';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly requestService: RequestService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.jwt;

    if (token) {
      const payload: JwtPayload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET_ACCESS_TOKEN'),
      });

      if (!payload) {
        res.redirect('/auth/login');
        return;
      }

      this.requestService.setUser({
        login: payload.login,
        id: payload.id,
      });
    } else {
      res.redirect('/auth/login');
      return;
    }

    next();
  }
}
