import crypto from "crypto";

const createSHA256Hash = (inputString) => {
  const hash = crypto.createHash("sha256");
  hash.update(inputString);
  return hash.digest("hex");
};

const validSHA256Hashs = (firstHash, secondHash) => {
  return firstHash === secondHash;
};

export { createSHA256Hash, validSHA256Hashs };
