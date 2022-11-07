import {
    ContractFactory,
    providers,
    Wallet,
    utils,
    getDefaultProvider,
  } from 'ethers';
  import { InternalServerErrorException } from '@nestjs/common';
  import * as tokenContractAddressJSON from '../token-contract/G11Token.address.json';
  import * as TokenizedBallotJSON from '../ballot-contract/TokenizedBallot.json';
  
  import * as dotenv from 'dotenv';
  dotenv.config();
  
  export class DeployDetails {
    success: Boolean;
    address: string;
    hash: string;
  }
  
  export default async (ballotOptions: string[]): Promise<DeployDetails> => {
    try {
      // setup provider
      const provider = new providers.AlchemyProvider(
        'goerli',
        `${process.env.ALCHEMY_API_KEY}`,
      );
  
      // const provider = getDefaultProvider('goerli');
      // connect wallet to provider to get signer
      const wallet = new Wallet(`${process.env.GOERLI_PRIVATE_KEY}`);
      const signer = wallet.connect(provider);
  
      // verify balance for deployment
      const balanceBN = await signer.getBalance();
      const balance = Number(utils.formatEther(balanceBN));
  
      // check balance of deployer account
      if (balance < 0.01)
        throw new InternalServerErrorException(
          'Not enough balance available to deploy poll contract - try again later!',
        );
  
      // create contract factory for poll contract deployment
      const pollContractFactory = new ContractFactory(
        TokenizedBallotJSON.abi,
        TokenizedBallotJSON.bytecode,
        signer,
      );
  
      console.log('...attempting deployment...');
  
      // get voting token contract address
      const votingTokenContractAddress =
        tokenContractAddressJSON['token-goerli-address'];
  
      console.log({ votingTokenContractAddress });
  
      // get voting token contract block number
      const votingTokenContractBlockNumber =
        tokenContractAddressJSON['token-goerli-block-height'];
  
      // generate contract-friendly ballot options
      const contractFriendlyBallotOptions = ballotOptions.map((string) =>
        utils.formatBytes32String(string),
      );
  
      console.log({
        contractFriendlyBallotOptions,
        votingTokenContractAddress,
        votingTokenContractBlockNumber,
      });
  
      // deploy poll contract with necessary parameters
      const pollContract = await pollContractFactory.deploy(
        contractFriendlyBallotOptions,
        votingTokenContractAddress,
        votingTokenContractBlockNumber,
      );
  
      console.log('...attempting waiting until txn mined...');
  
      // wait till transaction is mined
      await pollContract.deployTransaction.wait();
  
      //extract deploy details and return
      const deployDetails: DeployDetails = {
        success: true,
        address: pollContract.address,
        hash: pollContract.deployTransaction['hash'],
      };
  
      console.log(deployDetails);
  
      return deployDetails;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  };