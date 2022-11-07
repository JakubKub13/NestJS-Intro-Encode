import { ethers } from 'ethers';
import {
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as MyERC20JSON from './MyERC20Vote.address.json';

import * as dotenv from 'dotenv';
dotenv.config();

export default async (
  mintToAddress: string,
  tokenContract: ethers.Contract,
) => {
  try {
    // setup goerli provider
    const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL);

    // connect minter wallet to provider to get signer
    const wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`);
    const signer = wallet.connect(provider);

    // verify balance for minting
    const balanceBN = await signer.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceBN));

    if (balance < 0.01)
      throw new ServiceUnavailableException('Not enough balance!');

    const mintingTxn = await tokenContract.connect(signer).mint(mintToAddress, ethers.utils.parseEther(MyERC20JSON['TOKEN_PER_MINT_TIME_PERIOD']));
    await mintingTxn.wait();
    return true;
  } catch (error) {
    throw new InternalServerErrorException(
      'Minting failed! (Debug-Info: in mintTokensHelperScript)',
      error,
    );
  }
};