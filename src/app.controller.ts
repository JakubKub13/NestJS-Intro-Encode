import { Controller, Get, Param, BadGatewayException, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import isValidAddress from './helpers/isValidAddress';
import { MintVotingTokensDto } from './polls/dto/mint-voting-tokens.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Get token contract address
  @Get('token-contract-address')
  getTokenContractAddress() {
    return this.appService.getTokenContractAddress();
  }
}

