/**
 * @author 7w
 */
import React, {useState} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import Icon from "@components/icon"
import {TextField} from "./text"

export const ExhibitDataTitle = observer(
  ({prefix, text, onChange, onRemove}) => {
    const [isEdit, setIsEdit] = useState(false)

    return (
      <div className={c("fbh fbac")}>
        <div className={c(!onChange && "fb1")}>{prefix}</div>
        {typeof text !== "undefined" && (
          <div className="fb1 pr4 pl4">
            {isEdit ? (
              <TextField
                value={text}
                onChange={onChange}
                onBlur={() => {
                  setIsEdit(false)
                }}
              />
            ) : (
              text
            )}
          </div>
        )}
        {onChange && (
          <div
            className={c("pr8 hand")}
            onClick={() => {
              setIsEdit(!isEdit)
            }}
          >
            <Icon name="edit" fill="#ffffff" />
          </div>
        )}
        {onRemove && (
          <div className={c("hand")} onClick={onRemove}>
            <Icon name="remove" />
          </div>
        )}
      </div>
    )
  }
)
