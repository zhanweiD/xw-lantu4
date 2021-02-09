import React from 'react'
import s from './index.module.styl'


class HelloMessage extends React.Component {
  render() {
    return (
      <div className={s.root}>
        Hello
      </div>
    );
  }
}

export default HelloMessage