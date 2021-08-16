import React from "react"
import c from "classnames"
import s from "./user.module.styl"

const Item = ({label, children, className}) => (
  <div className={c("fbh fbac pt8 pb8 pl32 pr32", s.item, className)}>
    {label && <div className={s.label}>{label}</div>}
    <div className="fb1">{children}</div>
  </div>
)

const UserSection = ({title, children, className}) => (
  <section className={c(s.section, className)}>
    <div className={c("pt8 pb8 pl32 pr32", s.title)}>{title}</div>
    {children}
  </section>
)

UserSection.Item = Item

export default UserSection
