import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsMongoId, IsEnum, IsNumber, IsUrl } from 'class-validator';
import { MatchStatusEnum } from './match-status.enum';

export type MatchDocument = Match & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Match {
  @Prop({ type: Types.ObjectId })
  @IsMongoId({ each: true })
  tournamentId: Types.ObjectId;

  @Prop({
    type: String,
    enum: MatchStatusEnum,
    default: MatchStatusEnum.waiting,
  })
  @IsEnum(Object.values(MatchStatusEnum))
  status: MatchStatusEnum;

  @Prop({ type: Types.ObjectId })
  @IsMongoId()
  whitePlayerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  @IsMongoId()
  blackPlayerId: Types.ObjectId;

  @Prop({ type: Number })
  @IsNumber()
  whitePlayerScore?: number;

  @Prop({ type: Number })
  @IsNumber()
  blackPlayerScore?: number;

  @Prop({ type: Number })
  @IsNumber()
  round: number;

  @Prop({ type: Number })
  @IsNumber()
  match: number;

  @Prop({ type: String })
  @IsUrl()
  linkToMatch?: string;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
