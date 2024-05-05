import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Param,
  Render,
} from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post()
  async createTournament(@Body() body: CreateTournamentDto, @Res() res) {
    const data = await this.tournamentService.createTournament(body);

    res.status(200).json({
      success: true,
      data,
    });
  }

  @Render('./tournament/tournament')
  @Get(':tournamentId')
  async getTable(@Param() { tournamentId }) {
    const { table, matches, countSonnebornBergerSystem } =
      await this.tournamentService.getTable(tournamentId);

    return {
      table,
      matches,
      tournamentId,
      countSonnebornBergerSystem,
    };
  }

  @Get('list')
  async getTournaments() {
    return await this.tournamentService.list();
  }
}
