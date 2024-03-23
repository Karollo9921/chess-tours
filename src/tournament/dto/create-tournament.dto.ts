import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateTournamentDto {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  playerIds: string[];
}
