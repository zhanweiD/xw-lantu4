import React, {Children, useRef, useState, useMemo, useEffect} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import debounce from "lodash/debounce"
import s from "./tree.module.styl"
import MTree from "./model"
import IconButton from "../icon-button"
import {caculateBadgeValue, traverseTreeNodes, toArray} from "./util"

const NodeSwitcher = ({isOpen, onClick, iconSize = "12"}) => (
  <span onClick={onClick}>
    <IconButton
      className={c(s.treeIcon)}
      buttonSize={iconSize}
      iconSize={iconSize}
      icon={isOpen ? "arrow-down" : "arrow-right"}
    />
  </span>
)

const NodeTitle = ({title}) => (
  <div className={c("fb1", s.textHidden)}>{title}</div>
)

const ActionIcon = ({onClick}) => (
  <span onClick={onClick}>
    <IconButton className={s.treeIcon} iconSize="14" icon="more" />
  </span>
)

const TreeDetailRow = ({name, value}) => (
  <div className={c(s.treeDetailItem, s.treeDetailRow)}>
    <span style={{flexShrink: 0}} className="mr4">
      {name}
    </span>
    <span>：</span>
    <div className={s.treeDetailRowValue}>{value}</div>
  </div>
)

const TreeNodeDetail = ({title, style, badgeList = [], detailExtras}) => (
  <div style={style} className={c(s.treeNodeDetailBox, s.treeActionBox)}>
    <TreeDetailRow name="名称" value={title} />
    {badgeList.map(({name, value}) => (
      <TreeDetailRow key={name} name={name} value={value} />
    ))}
    {detailExtras.map(({name, value}) => (
      <TreeDetailRow key={name} name={name} value={value} />
    ))}
  </div>
)

const TreeActionList = ({itemKey, style, actionList, nodeData, treeModel}) => {
  useEffect(() => {
    window.addEventListener("click", treeModel.hiddenAction, false)
    return () =>
      window.removeEventListener("click", treeModel.hiddenAction, false)
  }, [])
  return (
    <div style={style} className={c(s.treeNodeDetailBox, s.treeActionBox)}>
      {actionList.map(({name, onClick}) => (
        <div
          key={name}
          onClick={(e) => {
            e.stopPropagation()
            onClick(itemKey, nodeData)
            treeModel.hiddenAction()
          }}
          className={s.actionItem}
        >
          {name}
        </div>
      ))}
    </div>
  )
}

// 渲染badge 99+ 类似这种徽标
const Badge = ({value}) => (
  <span className={s.treeBrage}>{caculateBadgeValue(value)}</span>
)

const TreeNode = observer((props) => {
  const {
    children,
    treeModel,
    level,
    // 每个节点必须有的唯一标识
    itemKey,
    // 是否是叶子节点，默认根据是否有子节点计算，可自定义
    isLeaf = null,
    // 节点style样式
    style,
    // 节点title
    title,
    rootActionList,
    // 标识该节点是否可以被选择
    selectable = true,
    // 绑定到节点上的数据
    nodeData = null,
    // 操作列表 {name: 'xxx', onclick: () => xx}
    actionList = null,
    // 徽标{name: 'xxx', value: 10}
    badgeList = [],
    // 详情除名称之外的 {name: 'xxx', value: 10}
    detailExtras = [],
    iconSize = "12",
    basePaddingLeft = 16,
    isActionIconshow = true
  } = props
  const {
    expandedKeys,
    selectedKeys,
    onSelfSelect,
    onSelfExpand,
    showDetail,
    currentActionKey,
    setActionKey
  } = treeModel
  const nodeRef = useRef(null)
  const [boxStyle, setStyle] = useState(null)
  const [actionBoxStyle, setActionBoxStyle] = useState(null)
  // const debounceBoxStyle = useDebounce(boxStyle, 500)
  const isOpen = expandedKeys.includes(itemKey) && !isLeaf
  const nodeIsLeaf = isLeaf === null ? Children.count(children) === 0 : isLeaf
  const isSelected = selectedKeys.includes(itemKey)
  const isShowActionList = currentActionKey === itemKey
  const setStyleDebounce = useMemo(
    () =>
      debounce((styles) => {
        setStyle(styles)
      }, 500),
    []
  )
  const paddingLeft = (() => {
    const basePad = level * basePaddingLeft
    if (nodeIsLeaf) {
      return basePad + iconSize // 补充图标的24px
    }
    return basePad
  })()
  const isDetailShow = showDetail && !isShowActionList && boxStyle
  return (
    <div>
      <div
        className={c("hand", s.treeNode, {
          [s.treeNode_selected]: isSelected
        })}
        onClick={() => selectable && onSelfSelect(itemKey, !isSelected, props)}
        style={{...style, paddingLeft}}
        ref={nodeRef}
        onMouseEnter={() => {
          if (!showDetail || isShowActionList) {
            return
          }
          const {width, left, top} = nodeRef.current.getBoundingClientRect()
          setStyleDebounce({
            left: left + width - 8,
            top
          })
        }}
        onMouseLeave={() => {
          setStyleDebounce.cancel()
          setStyle(null)
        }}
      >
        <div className={c("fbh fbac", s.treeNode_inner)}>
          {!nodeIsLeaf && (
            <NodeSwitcher
              onClick={(e) => {
                e.stopPropagation()
                onSelfExpand(itemKey, !isOpen, props)
              }}
              isOpen={isOpen}
              iconSize={iconSize}
            />
          )}
          <NodeTitle title={title} />
          {badgeList && badgeList.length
            ? badgeList.map((item) => (
                <Badge key={item.name} value={item.value} />
              ))
            : null}
          {isActionIconshow && (
            <ActionIcon
              onClick={(e) => {
                e.stopPropagation()
                const {width, left, top} =
                  nodeRef.current.getBoundingClientRect()
                setActionBoxStyle({
                  left: left + width - 8,
                  top
                })
                setStyleDebounce(null)
                setActionKey(itemKey)
              }}
            />
          )}
        </div>
        {isDetailShow && (
          <TreeNodeDetail
            badgeList={badgeList}
            detailExtras={detailExtras}
            style={boxStyle}
            title={title}
          />
        )}
        {isShowActionList && (
          <TreeActionList
            treeModel={treeModel}
            itemKey={itemKey}
            nodeData={nodeData}
            style={actionBoxStyle}
            actionList={actionList || rootActionList}
          />
        )}
      </div>
      {isOpen &&
        Children.map(children, (child) =>
          React.cloneElement(child, {
            level: level + 1,
            treeModel,
            rootActionList
          })
        )}
    </div>
  )
})

/**
 * 用户首先创建数据模型treeModel，然后传入Tree内
 * @props {treeModel} 基于MTree创造的实例
 */
const Tree = observer((props) => {
  const {children, treeModel, actionList, className, style, cref} = props
  if (!treeModel) {
    throw Error("Tree's props treeModel is required !")
  }
  useMemo(() => {
    // console.log('....................')
    if (treeModel.defaultExpandAll) {
      const ret = []
      traverseTreeNodes(toArray(props.children), (d) => ret.push(d))
      const keys = ret.map((node) => node.currentKey)
      treeModel.expandAll(keys)
    }
  }, [])
  return (
    <div className={c(s.treeContainer, className)} style={style} ref={cref}>
      {Children.map(children, (child) =>
        React.cloneElement(child, {
          level: 0,
          treeModel,
          rootActionList: actionList
        })
      )}
    </div>
  )
})

Tree.TreeNode = TreeNode
Tree.TreeModel = MTree

export default Tree
