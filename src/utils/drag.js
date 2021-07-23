import {fromEvent} from "rxjs"
import {switchMap, map, takeUntil, tap, filter} from "rxjs/operators"
import isFunction from "lodash/isFunction"
import querySelector from "./query-selector"
import isDef from "./is-def"
import createLog from "./create-log"

const log = createLog(import.meta.url)
export default class Drag {
  constructor({target, handle, preventHandle, start, move, end, getPosition}) {
    if (!isDef(target)) {
      log.warn(`target(${target}) is not defined in drag.init()`)
      return
    }

    if (!isDef(handle)) {
      handle = target
    }

    const targetElement = querySelector(target)
    if (!isDef(targetElement)) {
      log.warn(`target(${target}) is not found in drag.init()`)
      return
    }

    let handleElement = querySelector(handle)
    if (!isDef(handleElement)) {
      handleElement = targetElement
    }

    const preventHandleElement = querySelector(preventHandle)

    const mousedown$ = fromEvent(handleElement, "mousedown").pipe(
      filter((startEvent) => {
        // stopDrag
        if (
          startEvent.target &&
          startEvent.target.closest(".stopDrag") !== null
        ) {
          return false
        }
        return preventHandleElement
          ? preventHandleElement.contains(startEvent.target) === false
          : true
      }),
      tap((startEvent) => {
        isFunction(start) && start(startEvent)
      })
    )

    const mouseup$ = fromEvent(document, "mouseup").pipe(
      tap((endEvent) => {
        isFunction(end) && end(endEvent)
      })
    )

    const mousemove$ = fromEvent(document, "mousemove")

    const drag$ = mousedown$.pipe(
      switchMap((startEvent) => {
        const startLeft = targetElement.offsetLeft
        const startTop = targetElement.offsetTop

        return mousemove$.pipe(
          takeUntil(mouseup$),
          tap((moveEvent) => {
            isFunction(move) && move(moveEvent)
          }),
          map((moveEvent) => {
            moveEvent.preventDefault()
            const position = {
              left: moveEvent.x - startEvent.x + startLeft,
              top: moveEvent.y - startEvent.y + startTop
            }
            isFunction(getPosition) && getPosition(position)
            return position
          })
        )
      })
    )

    this.subscription = drag$.subscribe((position) => {
      targetElement.style.top = `${position.top}px`
      targetElement.style.left = `${position.left}px`
    })
  }

  destroy() {
    this.subscription.unsubscribe()
  }
}
