import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { AppService, PaymentOrder, ClaimPaymentDTO, VotePower } from './app.service';

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

  @Get('transaction-by-hash/:hash')
  getTransactionByHash(@Param('hash') hash: string) {
    return this.appService.getTransactionByHash(hash);
  }

  @Get('transaction-receipt-by-hash/:hash')
  getTransactionReceiptByHash(@Param('hash') hash: string) {
    return this.appService.getTransactionReceiptByHash(hash);
  }

  @Get('list-payment-orders')
  listPaymentOrders() {
    return this.appService.listPaymentOrders();
  }

  @Get('get-payment-order')
  getPaymentOrder(@Query("id") id: string) {
    return this.appService.getPaymentOrderById(id);
  }

  @Post('create-order')
  createOrder(@Body() body: PaymentOrder ) {
    console.log({body});
    this.appService.createPaymentOrder(body);
  }

  @Post('claim-payment')
  claimPayment(@Body() body: ClaimPaymentDTO) {
    return this.appService.claimPayment(body);
  }

  @Post('request-voting-tokens')
  request(@Body() body: any) {
    return this.appService.requestTokens(body);
  }

  @Get('ballot-address')
  getBallotAddress() {
    return this.appService.getBallotAddress();
  }

  @Post('mint')
  mint(@Body() body: Mint) {
    return this.appService.claimPayment(body);
  }

  @Post('delegate')
  delegate(@Body() body: VotePower) {
    return this.appService.delegate(body);
  }

  @Post('reference-block')
  referenceBlock(@Body() body: ReferenceBlock) {
    return this.appService.referenceBlock(body);
  }

  @Get('vote-power')
  getVotePower(@Body() body: VotePower) {
    return this.appService.getVotePower(body);
  }

  @Get('vote-number')
  getVote(@Body() body: VotePower) {
    return this.appService.delegate(body);
  }
}

