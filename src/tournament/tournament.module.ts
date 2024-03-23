import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Tournament, TournamentSchema } from './entity/tournament.entity';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';
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
        name: Tournament.name,
        schema: TournamentSchema,
      },
    ]),
    UserModule,
  ],
  controllers: [TournamentController],
  providers: [
    RequestService,
    TournamentService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class TournamentModule {}
