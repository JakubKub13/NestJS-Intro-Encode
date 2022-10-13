import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from "dotenv";
import * as TokenJson from "./assets/MyERC20Vote.json";

const CONTRACT_ADDRESS = "0x9828c2Ad0A705F3E8D21FE31A1a5edBFDfc67e1f"; 

@Injectable()
export class AppService {
  async getTotalSupply() {
    const provider = ethers.providers.getDefaultProvider("goerli");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, TokenJson.abi, provider);  
    const totalSupply = await contract.totalSupply();
    return totalSupply;
  }
}
