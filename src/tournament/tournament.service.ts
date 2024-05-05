import { Injectable } from '@nestjs/common';
import { RequestService } from '../request.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tournament } from './entity/tournament.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { Match } from 'src/match/entity/match.entity';
import { MatchStatusEnum } from 'src/match/entity/match-status.enum';
import { set, clone } from 'lodash';
import { MatchService } from 'src/match/match.service';

export interface IUserTable {
  userId: string;
  username: string;
  nick: string;
  numOfMatches: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  sb?: number;
}

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Tournament.name)
    private tournamentModel: Model<Tournament>,
    private readonly matchService: MatchService,
    private readonly requestService: RequestService,
  ) {}

  async list() {
    return this.tournamentModel.find().sort({ name: 1 });
  }

  async getTable(tournamentId: string) {
    const matches = await this.matchService.getMatchesByTournamentId(
      tournamentId,
    );

    const { countSonnebornBergerSystem } = await this.tournamentModel.findOne(
      {
        _id: new Types.ObjectId(tournamentId),
      },
      ['countSonnebornBergerSystem'],
    );

    const table = matches.reduce((acc: IUserTable[], cv) => {
      const user1 = acc.find((item) => item.nick === cv.whitePlayerNick);
      const user2 = acc.find((item) => item.nick === cv.blackPlayerNick);

      if (!user1) {
        acc.push({
          userId: `${cv.whitePlayerId}`,
          username: cv.whitePlayer,
          nick: cv.whitePlayerNick,
          numOfMatches: cv.whitePlayerScore + cv.blackPlayerScore === 1 ? 1 : 0,
          points: cv.whitePlayerScore || 0,
          wins: cv.whitePlayerScore === 1 ? 1 : 0,
          draws: cv.whitePlayerScore === 0.5 ? 1 : 0,
          losses: cv.whitePlayerScore === 0 ? 1 : 0,
        });
      } else {
        acc.forEach((ut) => {
          if (ut.nick === user1.nick) {
            ut.numOfMatches =
              cv.whitePlayerScore + cv.blackPlayerScore === 1
                ? ut.numOfMatches + 1
                : ut.numOfMatches;
            ut.points = ut.points + (cv.whitePlayerScore || 0);
            ut.wins = cv.whitePlayerScore === 1 ? ut.wins + 1 : ut.wins;
            ut.draws = cv.whitePlayerScore === 0.5 ? ut.draws + 1 : ut.draws;
            ut.losses = cv.whitePlayerScore === 0 ? ut.losses + 1 : ut.losses;
          }
        });
      }

      if (!user2) {
        acc.push({
          userId: `${cv.blackPlayerId}`,
          username: cv.blackPlayer,
          nick: cv.blackPlayerNick,
          numOfMatches: cv.whitePlayerScore + cv.blackPlayerScore === 1 ? 1 : 0,
          points: cv.blackPlayerScore || 0,
          wins: cv.blackPlayerScore === 1 ? 1 : 0,
          draws: cv.blackPlayerScore === 0.5 ? 1 : 0,
          losses: cv.blackPlayerScore === 0 ? 1 : 0,
        });
      } else {
        acc.forEach((ut) => {
          if (ut.nick === user2.nick) {
            ut.numOfMatches =
              cv.whitePlayerScore + cv.blackPlayerScore === 1
                ? ut.numOfMatches + 1
                : ut.numOfMatches;
            ut.points = ut.points + (cv.blackPlayerScore || 0);
            ut.wins = cv.blackPlayerScore === 1 ? ut.wins + 1 : ut.wins;
            ut.draws = cv.blackPlayerScore === 0.5 ? ut.draws + 1 : ut.draws;
            ut.losses = cv.blackPlayerScore === 0 ? ut.losses + 1 : ut.losses;
          }
        });
      }

      return acc;
    }, []);

    if (countSonnebornBergerSystem) {
      table.forEach((t) => this.addSBPoints(t, matches, table));
    }

    return {
      table: table.sort((a: IUserTable, b: IUserTable) =>
        this.sortMethod(a, b, countSonnebornBergerSystem),
      ),
      matches: matches.sort((a, b) => {
        if (a.round === b.round) {
          return a.match - b.match;
        }
        return a.round - b.round;
      }),
      countSonnebornBergerSystem,
    };
  }

  async createTournament(body: CreateTournamentDto): Promise<void> {
    // const { id } = this.requestService.getUser();
    const id = '65ff2e29ea140c5d4a5788d7';
    const tournament = await this.tournamentModel.create({
      participantsIds: body.playerIds.map((id) => new Types.ObjectId(id)),
      name: body.name,
      creatorId: new Types.ObjectId(id),
      countSonnebornBergerSystem: body.countSonnebornBergerSystem,
    });

    await this.matchService.insertMatches(
      this.getMatches(tournament._id, body.playerIds),
    );
  }

  private getMatches(
    tournamentId: Types.ObjectId,
    playerIds: string[],
  ): Match[] {
    const matches: Match[] = [];
    const numOfPlayers = playerIds.length;
    const helpListOfPlayers = playerIds.slice(0, numOfPlayers - 1);

    if (this.mod(numOfPlayers, 2) === 0) {
      for (let i = 0; i < numOfPlayers - 1; i++) {
        const round = i + 1;
        for (let j = 0; j < Math.floor(numOfPlayers / 2); j++) {
          if (j < Math.floor(numOfPlayers / 2) - 1) {
            matches.push({
              tournamentId,
              round,
              whitePlayerId: new Types.ObjectId(
                helpListOfPlayers[
                  j > i ? helpListOfPlayers.length + i - j : i - j
                ],
              ),
              blackPlayerId: new Types.ObjectId(
                helpListOfPlayers[this.mod(i + j + 1, numOfPlayers - 1)],
              ),
              status: MatchStatusEnum.waiting,
              match: 1,
            });
          } else {
            matches.push({
              tournamentId,
              round,
              whitePlayerId: new Types.ObjectId(
                helpListOfPlayers[
                  j > i ? helpListOfPlayers.length + i - j : i - j
                ],
              ),
              blackPlayerId: new Types.ObjectId(playerIds[numOfPlayers - 1]),
              status: MatchStatusEnum.waiting,
              match: 1,
            });
          }
        }
      }
    } else {
      for (let i = 0; i < numOfPlayers; i++) {
        const round = i + 1;
        for (let j = 0; j < Math.floor(numOfPlayers / 2); j++) {
          matches.push({
            tournamentId,
            round,
            whitePlayerId: new Types.ObjectId(
              playerIds[this.mod(i - j - 1, numOfPlayers)],
            ),
            blackPlayerId: new Types.ObjectId(
              playerIds[this.mod(i + j + 1, numOfPlayers)],
            ),
            status: MatchStatusEnum.waiting,
            match: 1,
          });
        }
      }
    }
    // return matches;
    return this.addRevenges(matches);
  }

  private addRevenges(matches: Match[]): Match[] {
    const revanges = [];
    for (const match of matches) {
      const revenge = clone(match);

      set(revenge, 'whitePlayerId', match.blackPlayerId);
      set(revenge, 'blackPlayerId', match.whitePlayerId);
      set(revenge, 'match', revenge.match + 1);

      revanges.push(revenge);
    }

    return [...matches, ...revanges];
  }

  private sortMethod(
    a: IUserTable,
    b: IUserTable,
    countSonnebornBergerSystem: boolean,
  ) {
    if (a.points !== b.points) {
      return b.points - a.points;
    }

    // if (a.numOfMatches !== b.numOfMatches) {
    //   return a.numOfMatches - b.numOfMatches;
    // }

    if (a.wins !== b.wins) {
      return b.wins - a.wins;
    }

    if (a.draws !== b.draws) {
      return b.draws - a.draws;
    }

    if (countSonnebornBergerSystem && a.sb !== b.sb) {
      return b.sb - a.sb;
    }

    return b.username.localeCompare(a.username);
  }

  private addSBPoints(
    t: IUserTable,
    matches: (Match & { whitePlayer: string; blackPlayer: string })[],
    table: IUserTable[],
  ) {
    let sb = 0;

    for (const match of matches) {
      if (
        `${match.whitePlayerId}` === `${t.userId}` &&
        match.whitePlayerScore
      ) {
        sb =
          sb +
          match.whitePlayerScore *
            table.find((tbl) => `${tbl.userId}` === `${match.blackPlayerId}`)
              .points;
      }

      if (
        `${match.blackPlayerId}` === `${t.userId}` &&
        match.blackPlayerScore
      ) {
        sb =
          sb +
          match.blackPlayerScore *
            table.find((tbl) => `${tbl.userId}` === `${match.whitePlayerId}`)
              .points;
      }
    }

    set(t, 'sb', sb);
  }

  private mod(n: number, m: number): number {
    return ((n % m) + m) % m;
  }
}
