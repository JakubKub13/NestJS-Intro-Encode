import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PollsService } from './polls.service';
import { Poll, PollDocument } from '../polls/schemas/poll.schema';

describe('PollsService', () => {
  let service: PollsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsService,
        {
          provide: getModelToken(Poll.name),
          useValue: Model<PollDocument>,
        },
      ],
    }).compile();

    service = module.get<PollsService>(PollsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});