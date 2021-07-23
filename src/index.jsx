import React, {Suspense} from "react"
import ReactDOM from "react-dom"
import {Route, Switch, BrowserRouter as Router} from "react-router-dom"
import "virtual:svg-icons-register"
import "@i18n"
import "@utils/common.styl"
import Main from "@pages/main"
import Login from "@pages/login"

const App = () => {
  return (
    <Suspense fallback={<div className="w100p h100v fbv fbjc fbac"></div>}>
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </Router>
    </Suspense>
  )
}

// 禁止浏览器回退
const popstate = () => {
  window.history.pushState(null, null, document.URL)
}
if (window.history && window.history.pushState) {
  popstate()
  // ! Chrome 下需要在任意区域点击一下才生效, Chrome@75.x 之后出现的安全策略
  // https://support.google.com/chrome/thread/8721521?msgid=10849294
  window.onpopstate = popstate
}

ReactDOM.render(<App />, document.getElementById("root"))
