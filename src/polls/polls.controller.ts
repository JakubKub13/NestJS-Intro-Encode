import {
    Body,
    Controller,
    Get,
    Post,
    BadRequestException,
    Param,
  } from '@nestjs/common';
  import { DeployPollDto } from './dto/deploy-poll-dto';
  import { CreatePollDto } from './dto/create-poll.dto';
  import { PollsService } from './polls.service';
  import isValidAddress from '../helpers/isValidAddress';
  
  @Controller('polls')
  export class PollsController {
    constructor(private readonly pollsService: PollsService) {}
  
    // get all polls
    @Get()
    getAll() {
      return this.pollsService.findAll();
    }
  
    // get a single poll by pollID
    @Get(':pollID')
    getPollByID(@Param('pollID') pollID: string) {
      return this.pollsService.findByID(pollID);
    }
  
    // create a new poll
    @Post('new-poll')
    createNewPoll(@Body() body: CreatePollDto) {
      if (!isValidAddress(body.creator))
        throw new BadRequestException('Invalid requesting account address!');
      return this.pollsService.create(body);
    }
  
    // deploy poll ballot contract
    @Post('deploy-poll-contract')
    deployPollContract(@Body() body: DeployPollDto) {
      return this.pollsService.deployPoll(body.pollID);
    }
  }