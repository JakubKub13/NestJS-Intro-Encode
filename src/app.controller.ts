import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { AppService, PaymentOrder, ClaimPaymentDTO, VotePower, Mint, CastVote} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('token-address')
  getTokenAddress() {
    return this.appService.getTokenAddress();
  }

  @Get('total-supply')
  getTotalSupply() {
    return this.appService.getTotalSupply();
  }

  @Get('allowance')
  getAllowance(@Query("from") from: string, @Query("to") to: string) {
    return this.appService.getAllowance(from, to);
  }

  @Post('create-order')
  createOrder(@Body() body: PaymentOrder ) {
    console.log({body});
    this.appService.createPaymentOrder(body);
  }

  @Post('mint')
  mint(@Body() body: Mint) {
    return this.appService.mint(body);
  }

  @Post('claim-payment')
  claimPayment(@Body() body: ClaimPaymentDTO) {
    return this.appService.claimPayment(body);
  }

  @Get('get-payment-order')
  getPaymentOrder(@Query("id") id: string) {
    return this.appService.getPaymentOrderById(id);
  }

  @Get('list-payment-orders')
  listPaymentOrders() {
    return this.appService.listPaymentOrders();
  }

  @Get('vote-power')
  getVotePower(@Query("address") address: string) {
    return this.appService.getVotePower(address);
  }

  @Get('vote-number')
  getVote(@Query("address") address: string) {
    return this.appService.getVote(address);
  }

  @Get('vote-spent') 
  votePowerSpent(@Query("address") address: string) {
    return this.appService.votePowerSpent(address);
  }

  @Get('proposal')
  getProposal() {
    return this.appService.getProposal()
  }

  @Post('delegate')
  delegate(@Body() body: VotePower) {
    return this.appService.delegate(body);
  }

  @Post('vote')
  postVote(@Body() body: CastVote) {
    return this.appService.postVote(body);
  }

  @Get('transaction-by-hash/:hash')
  getTransactionByHash(@Param('hash') hash: string) {
    return this.appService.getTransactionByHash(hash);
  }

  @Get('transaction-receipt-by-hash/:hash')
  getTransactionReceiptByHash(@Param('hash') hash: string) {
    return this.appService.getTransactionReceiptByHash(hash);
  }

  @Post('request-voting-tokens')
  request(@Body() body: any) {
    return this.appService.requestTokens(body);
  }

  @Get('ballot-address')
  getBallotAddress() {
    return this.appService.getBallotAddress();
  }  
}

