import { Controller, Put, Body, Param, Get, Render } from '@nestjs/common';
import { MatchService } from './match.service';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Render('./user/tournament/matches')
  @Get('/:userId/:tournamentId')
  async getMatchesByUser(@Param() { userId, tournamentId }) {
    const matches = await this.matchService.getmatchesByUser(
      userId,
      tournamentId,
    );

    return {
      matches: matches.sort((a, b) => {
        if (a.round === b.round) {
          return a.match - b.match;
        }
        return a.round - b.round;
      }),
      userId,
      tournamentId,
    };
  }

  @Get(':tournamentId')
  async getMatchesByTournament(@Param() { tournamentId }) {
    const matches = await this.matchService.getMatchesByTournamentId(
      tournamentId,
    );

    return {
      matches: matches.sort((a, b) => {
        if (a.round === b.round) {
          return a.match - b.match;
        }
        return a.round - b.round;
      }),
      tournamentId,
    };
  }

  @Put(':id')
  async updateMatch(@Param() { id }, @Body() body: UpdateMatchDto) {
    return await this.matchService.updateMatch(body, id);
  }
}
