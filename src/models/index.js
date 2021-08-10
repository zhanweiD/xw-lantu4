/*
 * @Author: your name
 * @Date: 2021-07-28 13:40:30
 * @LastEditTime: 2021-08-10 11:03:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/src/models/index.js
 */
import createEvent from "@utils/create-event"
import i18n from "@i18n"
import io from "@utils/io"
import tip from "@components/tip"
import {MRoot} from "./root"

const event = createEvent()

const root = MRoot.create(
  {},
  {
    event,
    io,
    i18n,
    tip
  }
)

document.addEventListener("contextmenu", (e) => {
  e.preventDefault()
})
window.waveview = root

export default root
