import { BadGatewayException, Injectable } from '@nestjs/common';
import { RequestService } from '../request.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match } from './entity/match.entity';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchStatusEnum } from './entity/match-status.enum';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name)
    private matchModel: Model<Match>,
    private readonly requestService: RequestService,
  ) {}
  async getmatchesByUser(userId: string, tournamentId: string) {
    return this.matchModel.aggregate([
      {
        $match: {
          tournamentId: new Types.ObjectId(tournamentId),
          $or: [
            { blackPlayerId: new Types.ObjectId(userId) },
            { whitePlayerId: new Types.ObjectId(userId) },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'whitePlayerId',
          foreignField: '_id',
          as: 'whitePlayerObj',
        },
      },
      {
        $unwind: '$whitePlayerObj',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'blackPlayerId',
          foreignField: '_id',
          as: 'blackPlayerObj',
        },
      },
      {
        $unwind: '$blackPlayerObj',
      },
      {
        $addFields: {
          whitePlayer: '$whitePlayerObj.login',
          blackPlayer: '$blackPlayerObj.login',
        },
      },
      {
        $project: {
          whitePlayerObj: 0,
          blackPlayerObj: 0,
        },
      },
    ]);
  }

  async getMatchesByTournamentId(tournamentId: string) {
    return this.matchModel.aggregate([
      {
        $match: {
          tournamentId: new Types.ObjectId(tournamentId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'whitePlayerId',
          foreignField: '_id',
          as: 'whitePlayerObj',
        },
      },
      {
        $unwind: '$whitePlayerObj',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'blackPlayerId',
          foreignField: '_id',
          as: 'blackPlayerObj',
        },
      },
      {
        $unwind: '$blackPlayerObj',
      },
      {
        $addFields: {
          whitePlayer: '$whitePlayerObj.login',
          blackPlayer: '$blackPlayerObj.login',
        },
      },
      {
        $project: {
          whitePlayerObj: 0,
          blackPlayerObj: 0,
        },
      },
    ]);
  }

  async updateMatch(body: UpdateMatchDto, matchId: string) {
    if (
      parseFloat(`${body.whitePlayerScore}`) +
        parseFloat(`${body.blackPlayerScore}`) !==
      1
    ) {
      throw new BadGatewayException('Bad result');
    }

    if (
      parseFloat(`${body.whitePlayerScore}`) !== 1 &&
      parseFloat(`${body.whitePlayerScore}`) !== 0.5 &&
      parseFloat(`${body.whitePlayerScore}`) !== 0
    ) {
      throw new BadGatewayException('Bad result');
    }

    await this.matchModel.findOneAndUpdate(
      { _id: new Types.ObjectId(matchId) },
      {
        whitePlayerScore: parseFloat(`${body.whitePlayerScore}`),
        blackPlayerScore: parseFloat(`${body.blackPlayerScore}`),
        linkToMatch: body.linkToMatch,
        status: MatchStatusEnum.finished,
      },
      {
        new: true,
      },
    );
  }

  async insertMatches(matches: Match[]) {
    return this.matchModel.insertMany(matches);
  }
}
