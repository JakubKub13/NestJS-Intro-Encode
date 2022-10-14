import { HttpException, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as TokenJson from "./assets/MyERC20Vote.json";
//import * as dotenv from "dotenv";
//dotenv.config();

const CONTRACT_ADDRESS = "0x9828c2Ad0A705F3E8D21FE31A1a5edBFDfc67e1f"; 



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

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  contract: ethers.Contract;

  database: PaymentOrder[];

  constructor() {
    this.provider = ethers.providers.getDefaultProvider("goerli");
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, TokenJson.abi, this.provider);  
    this.database = [];
  }
  async getTotalSupply() {
    const totalSupplyBn = await this.contract.totalSupply();
    const totalSupply = ethers.utils.formatEther(totalSupplyBn);
    return totalSupply;
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
    return tx;
  }
}


