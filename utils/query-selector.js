const querySelector = (selector) => {
  return selector instanceof Element ? selector : document.querySelector(selector)
}

export default querySelector
