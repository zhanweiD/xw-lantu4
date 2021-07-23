import createEvent from "@utils/create-event"
import {session, local} from "@utils/storage"
import i18n from "@i18n"
import io from "@utils/io"
// import tip from '@components/tip'
// import exhibitCollection from '../exhibit-collection'
import {MRoot} from "./root"

const event = createEvent()

const root = MRoot.create(
  {},
  {
    event,
    session,
    local,
    io,
    i18n
    // tip,
    // exhibitCollection,
  }
)

document.addEventListener("contextmenu", (e) => {
  e.preventDefault()
})
window.waveview = root

export default root
