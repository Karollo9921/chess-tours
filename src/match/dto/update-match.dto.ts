import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateMatchDto {
  @IsNotEmpty()
  @IsNumber()
  whitePlayerScore: number;

  @IsNotEmpty()
  @IsNumber()
  blackPlayerScore: number;

  @IsOptional()
  @IsString()
  @IsUrl()
  linkToMatch?: string;
}
