import * as React from 'react'
import './VideoPlayer.styl'
import videojs from 'video.js'

export default class Video extends React.Component {
  static key = 'video'

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      boxId: `MapVideoDiv${this.props.boxId}`,
    }
    this.reloadPlayer = this.reloadPlayer.bind(this)
    this.getDispose = this.getDispose.bind(this)
  }

  componentDidMount() {
    this.reloadPlayer(this.props.srcUrl)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.srcUrl !== nextProps.srcUrl) {
      this.getDispose()
      this.reloadPlayer(nextProps.srcUrl)
    }
  }

  componentWillUnmount() {
    this.getDispose()
  }

  reloadPlayer = (url) => {
    const id = this.props.boxId
    const videoBox = document.getElementById(`MapVideoDiv${id}`)
    const videoType = this.props.type === 'mp4' ? 'video/mp4' : 'application/x-mpegURL'
    videoBox.innerHTML = `<video id='videoinfo${id}' class='video-js vjs-default-skin' controls><source src=${url} type='${videoType}'></source></video>`
    const player = videojs(`videoinfo${id}`, {
      muted: true,
      controls: true,
      loop: true,
      hls: {
        withCredentials: true,
      },
    })
    player.play()
    player.on('timeupdate', () => {
      if (player.currentTime() > 1) {
        this.props.readyEvent()
        player.off('timeupdate')
      }
    })

    player.on('error', () => {
      this.props.readyEvent()
      player.off('error')
    })
    this.setState({visible: true})
  }

  getDispose() {
    if (this.state.visible) {
      const id = this.props.boxId
      const videoinfo = document.getElementById(`videoinfo${id}`)
      // eslint-disable-next-line no-constant-condition
      if (typeof videoinfo) {
        const player = videojs(`videoinfo${id}`)
        player.dispose()
        this.setState({visible: false})
      }
    }
  }

  render() {
    return <div id={this.state.boxId} className="mapVideoDiv" />
  }
}
