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

  constructor(@InjectModel(Voter.name) private voterModel: Model<VoterDocument>) {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL);
    this.contract = new ethers.Contract(tokenContractAddressJSON["token-goerli-address"], MyERC20JSON.abi, this.provider);
  }

  getTokenContractAddress() {
    return { result: tokenContractAddressJSON["token-goerli-address"] };
  }

  async getTotalSupply() {
    const totalSupplyBn = await this.contract.totalSupply();
    const totalSupply = ethers.utils.formatEther(totalSupplyBn);
    return { result: totalSupply };
  }

  async getAccountTokenBalance(accountAddress: string) {
    const tokenBalanceBn = await this.contract.balanceOf(accountAddress);
    const tokenBalance = ethers.utils.formatEther(tokenBalanceBn);
    return { result: tokenBalance };
  }

  async requestVotingTokens(mintVotingTokensDto: MintVotingTokensDto): Promise<Boolean> {
    const addressToMintTo = mintVotingTokensDto.address;
    const voterEntry: VoterTypeLocal[] = await this.voterModel.find({ address: addressToMintTo }).exec();

    if (voterEntry.length !== 0) {
      // If voter does exist, check isMintingAllowed and if is mint
      const matchedVoter = voterEntry[0];

      if(!isMintingAllowed(matchedVoter.lastMinEpoch)) throw new BadRequestException('Minting refused !');
      if(isMintingAllowed(matchedVoter.lastMinEpoch)) {
        const isMintingSuccess: boolean = await mintTokens(matchedVoter.address, this.contract);
        if (isMintingSuccess) {
          matchedVoter.lastMinEpoch = currentEpoch();
          await matchedVoter.save(); //check this
          return true;
        }
        throw new InternalServerErrorException('Minting failed! (debug info: voter exists in DB)');
      }
      return false;
    } else {
      const isMintingSuccess: boolean = await mintTokens(addressToMintTo, this.contract);
      if(!isMintingSuccess) throw new InternalServerErrorException('Minting failed! (Voter was not in DB)');
      const voterToCreate: VoterTypeLocal = {
        address: addressToMintTo,
        lastMinEpoch: currentEpoch()
      }
      const createdVoter = new this.voterModel(voterToCreate);
      await createdVoter.save();
      return true;
    }
  }

}

