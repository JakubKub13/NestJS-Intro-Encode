import { HttpException, Injectable } from '@nestjs/common';
import { ethers, Signer } from 'ethers';
import * as TokenJson from "./assets/MyERC20Vote.json";
import * as BallotJson from "./assets/TokenizedBallot.json";
require('dotenv').config();



const CONTRACT_ADDRESS = "0x9828c2Ad0A705F3E8D21FE31A1a5edBFDfc67e1f"; 
const CONTRACT_BALLOT_ADDRESS = "0xcC37F0a9Eb32cBC2b548A3e42F7711E6Bf368810";
const PRIVATE_KEY = process.env.PRIVATE_KEY;



export class ClaimPaymentDTO {
  id: string;
  secret: string;
  address: string;
}

export class PaymentOrder {
  id: string;
  secret: string;
  amount: number;
}

export class Mint {
  address: string;
  amount: string;
}

export class VotePower {
  address: string;
}

export class ReferenceBlock {
  block: bigint;
}

export class Proposal {
  name: string;
  voteCount: string;
}

export class CastVote {
  proposalIndex: number;
  amount: string;
}

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  contract: ethers.Contract;
  ballContract: ethers.Contract;
  database: PaymentOrder[];
  wallet: ethers.Wallet;
  signer: ethers.Signer;
  proposal: Proposal[];

  constructor() {
    this.provider = ethers.providers.getDefaultProvider("goerli");
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, TokenJson.abi, this.provider);
    this.ballContract = new ethers.Contract(CONTRACT_BALLOT_ADDRESS, BallotJson.abi, this.provider)  
    this.database = [];
    this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
  }

  getTokenAddress() {
    return {result: CONTRACT_ADDRESS};
  }

  async getTotalSupply() {
    const totalSupplyBn = await this.contract.totalSupply();
    const totalSupply = ethers.utils.formatEther(totalSupplyBn);
    return {result: totalSupply};
  }

  async getAllowance(from: string, to: string) {
    const allowanceBn = await this.contract.allowance(from, to);
    const allowance = ethers.utils.formatEther(allowanceBn);
    return allowance;
  }

  getTransactionByHash(hash: string) {
    return this.provider.getTransaction(hash);
  }

  async getTransactionReceiptByHash(hash: string) {
    const transaction = await this.getTransactionByHash(hash);
    return await transaction.wait();
  }

  createPaymentOrder(body: PaymentOrder) {
    this.database.push(body);
  }

  getPaymentOrderById(id: string) {
    const element = this.database.find((entry) => entry.id === id);
    if (!element) throw new HttpException("Not Found", 404);
    return { id: element.id, amount: element.amount };
  }

  listPaymentOrders() {
    const filteredDatabase = [];
    this.database.forEach(element => {
      filteredDatabase.push({id: element.id, amount: element.amount});
    });
    return filteredDatabase;
  }

  async claimPayment(body: ClaimPaymentDTO) {
    const privateKey1 = process.env.PRIVATE_KEY;
    const element = this.database.find((entry) => entry.id === body.id);
    if (!element) throw new HttpException("Not Found", 404);
    if (body.secret != element.secret) return false;
    const wallet = new ethers.Wallet(privateKey1, this.provider);
    const signedContract = this.contract.connect(wallet)
    // Todo mint tokens here
    const tx = await signedContract.mint(body.address, ethers.utils.parseEther(element.amount.toString()));
    return tx.hash;
  }

  requestTokens(body: any) {
    return { result: true };
  }

  async mint(body: Mint): Promise<string> {
    const signedContract = this.contract.connect(this.wallet);
    const mint = await signedContract.mint(body.address, ethers.utils.parseEther(body.amount));
    return mint;
  }

  async delegate(body: VotePower): Promise<string> {
    const signedContract = this.contract.connect(this.wallet);
    const delegate = await signedContract.delegate(body.address);
    return delegate;
  }

  async referenceBlock(body: ReferenceBlock): Promise<string> {
    const signedContract = this.ballContract.connect(this.wallet);
    const votePower = await signedContract.setReferenceBlock(body.block);
    return votePower;
  }

  getBallotAddress() {
    return {result: CONTRACT_BALLOT_ADDRESS};
  }

  async getVotePower(body: VotePower): Promise<string> {
    const signedContract = this.ballContract.connect(this.wallet);
    const votePower = await signedContract.votePower(body.address);
    return votePower.toString();
  }

  async votePowerSpent(body: VotePower): Promise<string> {
    const signedContract = this.ballContract.connect(this.wallet);
    const votePowerSpent = await signedContract.votePowerSpent(body.address);
    return votePowerSpent.toString();
  }

  async getVote(body: VotePower): Promise<string> {
    const signedContract = this.contract.connect(this.wallet);
    const voteNumber = await signedContract.getVotes(body.address);
    return voteNumber;
  }

  async getProposal(): Promise<any> {
    const signedContract = this.ballContract.connect(this.wallet);
    for(let index = 0; index < 3; index++) {
      const proposal = await signedContract.proposals(index);
      const proposalObj: Proposal = {
        name: ethers.utils.parseBytes32String(proposal.name),
        voteCount: ethers.utils.formatEther(proposal.voteCount)
      };
      this.proposal.push(proposalObj);
    }
    return this.proposal;
  }

  async postVote(body: CastVote): Promise<string> {
    const signedContract = this.ballContract.connect(this.wallet);
    const voting = await signedContract.vote(
      body.proposalIndex,
      ethers.utils.parseEther(body.amount)
    );
    const tx = await voting.wait(1);
    return tx;
  }
}


