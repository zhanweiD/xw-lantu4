import isNumeric from './is-numberic'

const fixRange = (n, min, max) => {
  if (isNumeric(min)) {
    n = n < min ? min : n
  }
  if (isNumeric(max)) {
    n = n > max ? max : n
  }
  return n
}

export default fixRange
