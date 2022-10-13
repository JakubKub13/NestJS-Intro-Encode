import { Injectable } from '@nestjs/common';

const CONTRACT_ADDRESS = "0x9828c2Ad0A705F3E8D21FE31A1a5edBFDfc67e1f"; 

@Injectable()
export class AppService {
  getTotalSupply() {
    throw new Error('Method not implemented.');
  }
}
