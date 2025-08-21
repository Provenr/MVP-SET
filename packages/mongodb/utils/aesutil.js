const crypto = require("crypto");
const aesutil = (module.exports = {});

/**
 * aes加密
 * @param data 待加密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
aesutil.encryption = function (data, key, iv) {
  iv = iv || "";
  let clearEncoding = "utf8";
  let cipherEncoding = "base64";
  let cipherChunks = [];
  let cipher = crypto.createCipheriv("aes-128-ecb", key, iv);
  cipher.setAutoPadding(true);
  cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
  cipherChunks.push(cipher.final(cipherEncoding));
  return cipherChunks.join("");
};

/**
 * aes解密
 * @param data 待解密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
aesutil.decryption = function (data, key, iv) {
  if (!data) {
    return "";
  }

  iv = iv || "";
  let clearEncoding = "utf8";
  let cipherEncoding = "base64";
  let cipherChunks = [];
  let decipher = crypto.createDecipheriv("aes-128-ecb", key, iv);
  decipher.setAutoPadding(true);
  cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
  cipherChunks.push(decipher.final(clearEncoding));
  return cipherChunks.join("");
};
