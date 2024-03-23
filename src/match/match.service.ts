import { Injectable } from '@nestjs/common';
import { RequestService } from '../request.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './entity/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name)
    private matchModel: Model<Match>,
    private readonly requestService: RequestService,
  ) {}

  // async createTournament(tournamentId): Promise<any> {}

  // async getTournamentParticipants(tournamentId): Promise<any> {}

  async insertMatches(matches: Match[]) {
    return this.matchModel.insertMany(matches);
  }
}
