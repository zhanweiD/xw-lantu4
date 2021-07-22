import {transform} from "@babel/standalone"

const makeFunction = (functionString) => {
  // 因为使用了babel编译，所以return必须包含在function之内
  // 'return' outside of function
  const startCode = "function wrapper() {\n"
  const endCode = "}"
  try {
    let {code} = transform([startCode, functionString, endCode].join(""), {
      sourceType: "script",
      presets: ["env"]
    })

    code = code.substring(startCode.length).slice(0, -1)

    // eslint-disable-next-line no-new-func
    return new Function(code)()
  } catch (e) {
    throw new Error(e)
  }
}

export default makeFunction
