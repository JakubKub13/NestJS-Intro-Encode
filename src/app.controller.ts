import { Controller, Get, Param, BadGatewayException, Post, Body, BadRequestException } from '@nestjs/common';
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

  @Get('token-total-supply')
  getTotalSupply() {
    return this.appService.getTotalSupply();
  }

  @Get('token-balance/:accountAddress')
  getAccountTokenBalance(@Param('accountAddress') accountAddress: string) {
    if (!isValidAddress(accountAddress)) throw new BadRequestException();
    return this.appService.getAccountTokenBalance(accountAddress);
  }

  @Post('request-voting-tokens')
  async requestVotingTokens(@Body() body: MintVotingTokensDto) {
    if (!isValidAddress(body.address)) throw new BadRequestException();
    const isMinSuccess = await this.appService.requestVotingTokens(body);
    return { result: isMinSuccess };
  }

  //register for vote

  //get list of all votes
}

