import { Controller, Get, Render, Put, Body, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Throttle(1, 15)
  @Put()
  async updateMatch(@Body() body: any, @Res() res) {}
}
