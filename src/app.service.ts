import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from "dotenv";

const CONTRACT_ADDRESS = "0x9828c2Ad0A705F3E8D21FE31A1a5edBFDfc67e1f"; 

@Injectable()
export class AppService {
  getTotalSupply() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, interface, provider)  
  }
}
