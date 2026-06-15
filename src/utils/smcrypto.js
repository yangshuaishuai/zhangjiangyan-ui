var sm2 = require("sm-crypto").sm2;
var sm4 = require("sm-crypto").sm4;
var publicKey =
    "047e82b41af5a1ba63e236c39d064edf2401633be3547a8cbec0cb188c3b57cb1d5d58ded07f760aebc6a0953369221019c97e62f6daffc0652e0edd4075fca12a"; //前端生成的公钥给后端
var publicKey2 = "0453f93d2bd4ce03dbbf1eedac2cf70f5fd63883e587bef4b585f2273a24860bce8838c741332c88e43768584f654803fc1e6013257c68eead056832ccc3316014"
// sm2生成公私钥
export function sm2key() {
    let keypair = sm2.generateKeyPairHex();
    publicKey = keypair.publicKey; // 随机生成公钥
    privateKey = keypair.privateKey; // 随机生成私钥
}

// sm2加密
export function encryptsm2(msgString, publicKey) {
    const cipherMode = 1;
    let encryptData = sm2.doEncrypt(msgString, publicKey, cipherMode);
    return encryptData;
}
// sm2解密
export function decryptsm2(encryptData, privateKey) {
    const cipherMode = 1;
    let decryptData = sm2.doDecrypt(encryptData, privateKey, cipherMode);
    return decryptData;
}
// sm4加密
export function encryptsm4(msg) {
    let $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678oOLl9gqVvUuI1";
    let maxPos = $chars.length;
    let req = "";
    for (let i = 0; i < 32; i++) {
        req += $chars.charAt(Math.floor(Math.random() * maxPos));
    }

    const key = req; // 可以为 16 进制串或字节数组，要求为 128 比特
    let encryptData = sm4.encrypt(msg, key); // 对称 加密，默认输出 16 进制字符串，默认使用 pkcs#7 填充（传 pkcs#5 也会走 pkcs#7 填充）
    req = encryptsm2(req, publicKey);
    return { encryptData, req, key };
}
// sm4解密
export function decryptsm4(msg, key) {
    let decryptData = sm4.decrypt(msg, key);
    return decryptData;
}

// sm4加密
export function encryptsm4file(msg) {
    let $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678oOLl9gqVvUuI1";
    let maxPos = $chars.length;
    let req = "";
    for (let i = 0; i < 32; i++) {
        req += $chars.charAt(Math.floor(Math.random() * maxPos));
    }

    const key = req; // 可以为 16 进制串或字节数组，要求为 128 比特
    let encryptData = sm4.encrypt(msg, key); // 对称 加密，默认输出 16 进制字符串，默认使用 pkcs#7 填充（传 pkcs#5 也会走 pkcs#7 填充）
    req = encryptsm2(req, publicKey2);
    return { encryptData, req, key };
}