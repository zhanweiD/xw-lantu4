/* eslint-disable no-restricted-globals */
/* eslint-disable no-bitwise */
/* eslint no-underscore-dangle: off */

export default (input) => new Buffer(input, 'base64').toString()
