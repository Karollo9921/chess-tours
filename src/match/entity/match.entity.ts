import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsMongoId, IsEnum, IsNumber } from 'class-validator';
import { MatchStatusEnum } from './match-status.enum';

export type MatchtDocument = Match & Document;

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
  whitePlayer: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  @IsMongoId()
  blackPlayer: Types.ObjectId;

  @Prop({ type: Number })
  @IsNumber()
  whitePlayerScore?: number;

  @Prop({ type: Number })
  @IsNumber()
  blackPlayerScore?: number;

  @Prop({ type: Number })
  @IsNumber()
  round: number;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
