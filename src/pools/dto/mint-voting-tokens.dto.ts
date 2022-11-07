import { ApiProperty } from '@nestjs/swagger';

export class MintVotingTokensDto {
  @ApiProperty()
  address: string;
}