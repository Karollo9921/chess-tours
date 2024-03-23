import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsMongoId, IsEnum } from 'class-validator';
import { TournamentStatusEnum } from './tournament-status.enum';

export type TournamentDocument = Tournament & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Tournament {
  @Prop({ type: [{ type: Types.ObjectId }], required: true })
  @IsMongoId({ each: true })
  participantsIds: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, required: true })
  @IsMongoId()
  creatorId: Types.ObjectId;

  @Prop({
    type: String,
    enum: TournamentStatusEnum,
    default: TournamentStatusEnum.created,
  })
  @IsEnum(Object.values(TournamentStatusEnum))
  status: TournamentStatusEnum;
}

export const TournamentSchema = SchemaFactory.createForClass(Tournament);
