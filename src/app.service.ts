import { Model } from "mongoose";
import { Injectable, InternalServerErrorException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Voter, VoterDocument } from "./schemas/voter.schema";
import { MintVotingTokensDto } from "./polls/dto/mint-voting-tokens.dto";
import { ethers } from "ethers";
import * as tokenContractAddressJSON from '../src/assets/MyERC20Vote.address.json';
import * as MyERC20JSON from "../src/assets/MyERC20Vote.json";
import * as dotenv from 'dotenv';
dotenv.config();
import isMintingAllowed from "./helpers/isMintingAllowed";
import currentEpoch from "./helpers/currentEpoch";
import mintTokens from "./assets/mintTokens.helper";

type VoterTypeLocal = {
  address: string;
  lastMinEpoch: number;
  save?: () => {};
}

@Injectable()
export class AppService {
  provider: ethers.providers.JsonRpcProvider;
  contract: ethers.Contract;

  constructor(@InjectModel(Voter.name) private voterName: Model<VoterDocument>) {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL);
    this.contract = new ethers.Contract(tokenContractAddressJSON["token-goerli-address"], MyERC20JSON.abi, this.provider);
  }

  
}

