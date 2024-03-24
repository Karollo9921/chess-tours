import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tournament, TournamentSchema } from './entity/tournament.entity';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';
import { RequestService } from 'src/request.service';
import { UserModule } from 'src/user/user.module';
import { MatchModule } from 'src/match/match.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tournament.name,
        schema: TournamentSchema,
      },
    ]),
    UserModule,
    MatchModule,
  ],
  controllers: [TournamentController],
  providers: [RequestService, TournamentService],
  exports: [TournamentService],
})
export class TournamentModule {}
