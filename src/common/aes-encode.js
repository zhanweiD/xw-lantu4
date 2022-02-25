import AES from 'crypto-js/aes'
/**
 *
 * Aes 加解密，测试无长度限制
 */
export default input => AES.encrypt(input, 'waveview').toString()
