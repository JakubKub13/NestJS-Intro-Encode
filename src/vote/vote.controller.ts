import { Controller, Get, Post, Body } from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote-dto';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  // create a new vote
  @Post('new-vote')
  createNewPoll(@Body() body: CreateVoteDto) {
    return this.voteService.createVote(body);
  }

  // get all votes
  @Get()
  getAllVotes() {
    return this.voteService.getAllVotes();
  }
}