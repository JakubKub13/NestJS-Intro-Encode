import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vote, VoteDocument } from '../vote/schemas/vote.schema';
import { CreateVoteDto } from './dto/create-vote-dto';

@Injectable()
export class VoteService {
  constructor(@InjectModel(Vote.name) private voteModel: Model<VoteDocument>) {}

  // create a new vote
  async createVote(createVoteDto: CreateVoteDto): Promise<any> {
    const createdVote = new this.voteModel(createVoteDto);
    const savedVote = await createdVote.save();
    return { result: true, savedVote };
  }

  // deliver all existing votes
  async getAllVotes(): Promise<any> {
    return { result: await this.voteModel.find().exec() };
  }
}