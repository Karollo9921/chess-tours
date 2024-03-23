import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { configValidation } from './config.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { TournamentModule } from './tournament/tournament.module';
import { AuthenticationMiddleware } from './middleware/authMiddleware';
import { JwtModule } from '@nestjs/jwt';
import { RequestService } from './request.service';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_ACCESS_TOKEN'),
        };
      },
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configValidation,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<string>('MONGO_URI'),
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    TournamentModule,
    MatchModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, RequestService],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthenticationMiddleware)
//       .forRoutes({ path: 'tournament/*', method: RequestMethod.ALL });
//   }
// }
