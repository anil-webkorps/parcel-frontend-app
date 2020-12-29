import { utils } from "ethers";
import { MESSAGE_TO_SIGN } from "constants/index";

export const getPublicKey = (sign) => {
  const msgHash = utils.hashMessage(MESSAGE_TO_SIGN);
  const publicKey = utils.recoverPublicKey(msgHash, sign);
  return publicKey;
};
