import { IsBoolean, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateTournamentDto {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  playerIds: string[];

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  countSonnebornBergerSystem: boolean;
}
