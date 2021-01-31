import { cryptoUtils } from "parcel-sdk";

export const getPublicKey = (sign) => {
  // const msgHash = utils.hashMessage(MESSAGE_TO_SIGN);
  // const publicKey = utils.recoverPublicKey(msgHash, sign);
  const publicKey = cryptoUtils.getPublicKey(sign);

  return publicKey;
};
