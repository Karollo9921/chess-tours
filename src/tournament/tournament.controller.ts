import { Controller, Post, Body, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  // @Throttle(1, 15)
  @Post()
  async createTournament(@Body() body: CreateTournamentDto, @Res() res) {
    const data = await this.tournamentService.createTournament(body);

    res.status(200).json({
      success: true,
      data,
    });
  }

  // @Get(':tournamentId')
  // @Render('index')
  // showTournament(): { success: boolean } {
  //   return { success: true };
  // }
}
