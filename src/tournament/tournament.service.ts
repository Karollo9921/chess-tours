import { Injectable } from '@nestjs/common';
import { RequestService } from '../request.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tournament } from './entity/tournament.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { Match } from 'src/match/entity/match.entity';
import { MatchStatusEnum } from 'src/match/entity/match-status.enum';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Tournament.name)
    private tournamentModel: Model<Tournament>,
    private readonly requestService: RequestService,
  ) {}

  async createTournament(body: CreateTournamentDto): Promise<any> {
    // const { id } = this.requestService.getUser();
    const id = '65ff2e29ea140c5d4a5788d7';
    const tournament = await this.tournamentModel.create({
      participantsIds: body.playerIds.map((id) => new Types.ObjectId(id)),
      creatorId: new Types.ObjectId(id),
    });

    const matches = this.getMatches(tournament._id, body.playerIds);

    if (matches.length) {
      return matches;
    }
  }

  private getMatches(
    tournamentId: Types.ObjectId,
    playerIds: string[],
  ): Match[] {
    const matches: Match[] = [];
    const numOfPlayers = playerIds.length;
    const helpListOfPlayers = playerIds.slice(0, numOfPlayers - 1);

    if (numOfPlayers % 2 === 0) {
      for (let i = 0; i < numOfPlayers - 1; i++) {
        const round = i + 1;
        for (let j = 0; j < Math.floor(numOfPlayers / 2); j++) {
          if (j < Math.floor(numOfPlayers / 2) - 1) {
            matches.push({
              tournamentId,
              round,
              whitePlayer: new Types.ObjectId(helpListOfPlayers[i - j]),
              blackPlayer: new Types.ObjectId(
                helpListOfPlayers[(i + j + 1) % (numOfPlayers - 1)],
              ),
              status: MatchStatusEnum.waiting,
            });
          } else {
            matches.push({
              tournamentId,
              round,
              whitePlayer: new Types.ObjectId(helpListOfPlayers[i - j]),
              blackPlayer: new Types.ObjectId(playerIds[numOfPlayers - 1]),
              status: MatchStatusEnum.waiting,
            });
          }
        }
      }
    } else {
      for (let i = 0; i < numOfPlayers; i++) {
        const round = i + 1;
        for (let j = 0; j < Math.floor(numOfPlayers / 2); j++) {
          if (j < Math.floor(numOfPlayers / 2)) {
            matches.push({
              tournamentId,
              round,
              whitePlayer: new Types.ObjectId(
                playerIds[(i - j - 1 + numOfPlayers) % numOfPlayers],
              ),
              blackPlayer: new Types.ObjectId(
                playerIds[(i - j + 1) % numOfPlayers],
              ),
              status: MatchStatusEnum.waiting,
            });
          } else {
            matches.push({
              tournamentId,
              round,
              whitePlayer: new Types.ObjectId(
                playerIds[(i - j - 1 + numOfPlayers) % numOfPlayers],
              ),
              blackPlayer: new Types.ObjectId(
                playerIds[(i - j + 1) % numOfPlayers],
              ),
              status: MatchStatusEnum.waiting,
            });
          }
        }
      }
    }
    return matches;
  }
}
