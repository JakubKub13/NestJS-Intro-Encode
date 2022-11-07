import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vote, VoteSchema } from '../vote/schemas/vote.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }]),
  ],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}