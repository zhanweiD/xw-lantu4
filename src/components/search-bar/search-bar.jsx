// !!! 改造
import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import IconButton from "@components/icon-button"
import s from "./search-bar.module.styl"

const SearchBar = ({
  placeholder,
  className,
  value = "",
  onChange,
  onSearch
}) => {
  const {t} = useTranslation()
  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onSearch(value)
    }
  }
  return (
    <div className={c("fbh fbac cfw2 pl8", s.searchbar, className)}>
      <div className="fb1">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          onChange={(e) => onChange(e)}
        />
      </div>
      {value ? (
        <IconButton
          icon="close"
          title={t("remove")}
          onClick={() => {
            onChange({target: {value: ""}})
          }}
        />
      ) : (
        ""
      )}
      <IconButton
        icon="search"
        title={t("search")}
        className="cfw6"
        onClick={() => onSearch && onSearch(value)}
      />
    </div>
  )
}

export default observer(SearchBar)
