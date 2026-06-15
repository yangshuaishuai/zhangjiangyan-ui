
import CryptoJS from 'crypto-js'
//DES加密 Pkcs7填充方式
export function encryptByDES(message, key) {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

//DES解密
export function decryptByDES(ciphertext, key) {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    console.log(keyHex);
    // direct decrypt ciphertext
    const decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    console.log(111);
    console.log(decrypted)
    console.log(decrypted.toString())

    return decrypted.toString(CryptoJS.enc.Utf8);
}


// const _key = 'abcdefghijklmn'
// const _password = '123456'

// // 加密
// console.log(this.encryptByDES(_password,_key))
// //解密
// console.log(this.decryptByDES(_password,_key))
