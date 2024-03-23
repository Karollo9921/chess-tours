import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Match, MatchSchema } from './entity/match.entity';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { RequestService } from 'src/request.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    MongooseModule.forFeature([
      {
        name: Match.name,
        schema: MatchSchema,
      },
    ]),
    UserModule,
  ],
  controllers: [MatchController],
  providers: [
    RequestService,
    MatchService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class MatchModule {}
