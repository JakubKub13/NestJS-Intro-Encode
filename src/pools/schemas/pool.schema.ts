import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PollDocument = Poll & Document;

// schemaType limitations: https://mongoosejs.com/docs/guide.html#definition

@Schema()
export class Poll {
  @Prop({ required: true, unique: true })
  question: string;

  @Prop({ required: true })
  proposals: string[];

  @Prop({ required: true })
  creator: string;

  @Prop()
  isDeployed: Boolean;

  @Prop()
  deploymentHash: string;

  @Prop()
  deploymentAddress: string;
}

export const PollSchema = SchemaFactory.createForClass(Poll);