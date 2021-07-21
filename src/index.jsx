import React from 'react'
import ReactDOM from 'react-dom'
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom'
import Main from './pages/main'
import Login from './pages/login'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))