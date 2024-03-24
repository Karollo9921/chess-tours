import { Controller, Get, Render } from '@nestjs/common';
import { TournamentService } from './tournament/tournament.service';

@Controller()
export class AppController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  @Render('index')
  async showMainPage() {
    return { tournaments: await this.tournamentService.list() };
  }
}
