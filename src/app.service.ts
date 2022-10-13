import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from "dotenv";
import * as TokenJson from "./assets/MyERC20Vote.json";

const CONTRACT_ADDRESS = "0x9828c2Ad0A705F3E8D21FE31A1a5edBFDfc67e1f"; 

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  contract: ethers.Contract;

  constructor() {
    this.provider = ethers.providers.getDefaultProvider("goerli");
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, TokenJson.abi, this.provider);  
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
}
