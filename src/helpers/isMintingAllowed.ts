import currentEpoch from './currentEpoch';
import * as MyERC20VotesJSON from '../assets/MyERC20Vote.address.json';

export default (lastMintEpoch: number) => {
  const epochDelta = Math.abs(currentEpoch() - lastMintEpoch);
  return epochDelta > MyERC20VotesJSON['MINTING_COOLING_PERIOD_EPOCH_DELTA'];
};