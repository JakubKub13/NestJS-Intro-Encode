import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { Poll, PollDocument } from '../polls/schemas/poll.schema';

describe('PollsController', () => {
  let controller: PollsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollsController],
      providers: [
        PollsService,
        {
          provide: getModelToken(Poll.name),
          useValue: Model<PollDocument>,
        },
      ],
    }).compile();

    controller = module.get<PollsController>(PollsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});