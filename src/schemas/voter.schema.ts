import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VoterDocument = Voter & Document;

// schemaType limitations: https://mongoosejs.com/docs/guide.html#definition

@Schema()
export class Voter {
  @Prop({ required: true, unique: true })
  address: string;

  @Prop({ required: true })
  lastMintEpoch: number;
}

export const VoterSchema = SchemaFactory.createForClass(Voter);