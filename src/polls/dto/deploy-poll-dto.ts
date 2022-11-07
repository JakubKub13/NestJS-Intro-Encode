import { ApiProperty } from '@nestjs/swagger';

export class DeployPollDto {
  @ApiProperty()
  pollID: string;
}