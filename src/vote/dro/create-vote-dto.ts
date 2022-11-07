import { ApiProperty } from '@nestjs/swagger';

export class CreateVoteDto {
  @ApiProperty()
  voterAddress: string;

  @ApiProperty()
  creationEpoch: number;

  @ApiProperty()
  voteForQuestion: string;

  @ApiProperty()
  selection: string;
}