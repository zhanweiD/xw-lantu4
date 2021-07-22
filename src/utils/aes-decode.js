import AES from "crypto-js/aes"
import UTF8 from "crypto-js/enc-utf8"
/**
 *
 * Aes 加解密，测试无长度限制
 */
export default (input) => AES.decrypt(input, "waveview").toString(UTF8)
