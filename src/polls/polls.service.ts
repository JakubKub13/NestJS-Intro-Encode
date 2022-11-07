import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Poll, PollDocument } from './schemas/poll.schema';
import { CreatePollDto } from './dto/create-poll.dto';
import deployToGoerli, {
  DeployDetails,
} from '../assets/deployToGoerli.helper';

@Injectable()
export class PollsService {
  constructor(@InjectModel(Poll.name) private pollModel: Model<PollDocument>) {}

  // create a new poll
  async create(createPollDto: CreatePollDto): Promise<any> {
    const createdPoll = new this.pollModel(createPollDto);
    const savedPoll = await createdPoll.save();
    return { result: true, savedPoll };
  }

  // get a single poll by pollID
  async findByID(pollID: string): Promise<any> {
    return await this.pollModel.findById(pollID).exec();
  }

  // deliver all existing polls
  async findAll(): Promise<Poll[]> {
    return this.pollModel.find().exec();
  }

  // deploy a poll contract to goerli
  async deployPoll(pollID: string) {
    // get DB entry of selected poll
    const matchedPoll: any = await this.pollModel.findById(pollID).exec();

    // check if poll already deployed
    if (matchedPoll.isDeployed)
      throw new BadRequestException(
        `Poll already deployed (Goerli testnet contract address: ${matchedPoll.deploymentAddress} )`,
      );

    // extract poll details for contract deployment
    const pollOptions = matchedPoll.proposals;
    console.log({ pollOptions });

    // deploy with helper function
    const deployDetails: DeployDetails = await deployToGoerli(pollOptions);

    matchedPoll.isDeployed = deployDetails.success;
    matchedPoll.deploymentHash = deployDetails.hash;
    matchedPoll.deploymentAddress = deployDetails.address;

    const saveMatchedPoll = await matchedPoll.save();

    return { result: true, saveMatchedPoll };
  }
}