import { cryptoUtils } from "parcel-sdk";

export const getPublicKey = (sign) => {
  const publicKey = cryptoUtils.getPublicKey(sign);

  return publicKey;
};
