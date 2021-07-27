import React, {useEffect, useState} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import isDef from "@utils/is-def"
import IconButton from "@components/icon-button"
import cloneDeep from "lodash/cloneDeep"
import ConstructSection from "./construct-section"
import s from "./construct-layer.module.styl"

const makeGroupMapping = (layers) => {
  if (!isDef(layers)) return undefined
  const cloneBox = cloneDeep(layers)
  cloneBox.sort((a, b) => a.groups.length - b.groups.length)
  const groupMapping = {}
  cloneBox.forEach((layer) => {
    const groupId = layer.groups.pop() || "root"
    !groupMapping[groupId] && (groupMapping[groupId] = [])
    groupMapping[groupId].push(layer)
  })
  return groupMapping
}
// 分组递归渲染
const GroupRender = (props) => {
  const {
    list,
    level = 0,
    source = [],
    groups = [],
    hides,
    folds,
    disabled,
    focus,
    onFold,
    onClick,
    onSelect,
    onContextMenu,
    onEyeClick
  } = props
  const groupMap = makeGroupMapping(cloneDeep(list))

  return (
    isDef(groupMap) &&
    Object.entries(groupMap).map(([groupId, layers]) => {
      if (groupId === "root") {
        return layers.map((layer) => {
          return (
            <ConstructSection
              key={layer.id}
              {...props}
              hideNameBar
              isFocus={focus[layer.id]}
              id={layer.id}
              name={layer.name}
              paddingLeft={8}
              onClick={(e) => {
                onClick(
                  layer.id,
                  {
                    groupId: layer.id.split(".")[0],
                    layerId: layer.id.split(".")[1],
                    type: "layer"
                  },
                  e
                )
              }}
              onSelect={() => {
                onSelect(layer.id, true)
              }}
              onContextMenu={() => {
                onContextMenu(layer.id)
                onSelect(layer.id, true)
              }}
              onEyeClick={(isVisible) => {
                onEyeClick(layer.id, true, isVisible)
              }}
            />
          )
        })
      }

      const mapper = {}
      layers.forEach((layer) => {
        if (layer.groups.length > 0) {
          mapper[groupId] = "group"
        } else {
          mapper[layer.id] = "layer"
        }
      })

      layers = layers.filter((layer) => !mapper[layer.id])

      const currentGroup = groups.find(({id}) => id === groupId)

      return (
        <div key={groupId} className="group">
          <ConstructSection
            {...props}
            name={currentGroup.name}
            paddingLeft={level * 8}
            isFold={!!folds[groupId]}
            isHide={!!hides[groupId]}
            isFocus={focus[groupId]}
            isVisible={currentGroup.isVisible}
            isDisabled={disabled[groupId]}
            onFold={(folded) => {
              onFold(groupId, folded)
            }}
            onClick={(e) => {
              onClick(
                groupId,
                {
                  groupId,
                  type: "group"
                },
                e
              )
            }}
            onSelect={() => {
              onSelect(groupId, false)
            }}
            onEyeClick={(isVisible) => {
              onEyeClick(groupId, false, isVisible)
            }}
            onContextMenu={() => {
              onContextMenu(groupId)
              onSelect(groupId, false)
            }}
          />
          {Object.entries(mapper).map(([id, type]) => {
            return (
              <div key={id}>
                {type === "layer" ? (
                  <ConstructSection
                    {...props}
                    hideNameBar
                    id={id}
                    name={source.find((layer) => layer.id === id).name}
                    isHide={!!hides[id]}
                    isDisabled={disabled[id]}
                    isFocus={focus[id]}
                    paddingLeft={(level + 1) * 8 + 24}
                    onClick={(e) => {
                      onClick(
                        id,
                        {
                          groupId: id.split(".")[0],
                          layerId: id.split(".")[1],
                          type: "layer"
                        },
                        e
                      )
                    }}
                    onSelect={() => onSelect(id, true)}
                    onEyeClick={(isVisible) => {
                      onEyeClick(id, true, isVisible)
                    }}
                    onContextMenu={() => {
                      onContextMenu(id)
                      onSelect(id, true)
                    }}
                  />
                ) : (
                  <GroupRender {...props} list={layers} level={level + 1} />
                )}
              </div>
            )
          })}
        </div>
      )
    })
  )
}

const ConstructLayer = ({
  value,
  withToolbar = false,
  className,
  nameClassName,
  type = "wave",
  buttons,
  onAdd = () => {},
  onContextMenu = () => {},
  onEyeClick = () => {},
  onClick = () => {}
}) => {
  const [isFolded, setIsFolded] = useState({})
  const [isHided, setIsHided] = useState({})
  const [isFocused, setIsFocused] = useState({})
  const [isDisabled, setIsDisabled] = useState({})

  useEffect(() => {
    const {groups} = value
    const mapper = {}
    const disabled = {}
    groups.forEach((group) => (mapper[group.id] = !group.isVisible))
    // 未排除子级重复查询，函数待优化
    groups.forEach((group) => {
      if (group.isVisible === false) {
        getGroupScope(group.id, disabled, mapper, true)
      }
    })
    setIsDisabled(disabled)
  }, [])

  // group获取对其子级的影响
  const getGroupScope = (groupId, target, dependency, current) => {
    const {source, groups} = value

    // 子级group
    const layersInGroup = source.filter(
      (layer) => layer.groups.indexOf(groupId) > -1
    )
    let maxGroups = []
    layersInGroup.forEach((layer) => {
      if (layer.groups.length > maxGroups.length) {
        maxGroups = layer.groups
      }
    })
    maxGroups.forEach((id, index) => {
      if (maxGroups.indexOf(id) < maxGroups.indexOf(groupId)) {
        if (dependency[maxGroups[index + 1]]) {
          target[id] = true
        } else {
          target[id] = current
        }
      }
    })
    // 子级layer
    groups
      .find(({id}) => id === groupId)
      .layers.forEach((layerId) => {
        const parentId = source.find(({id}) => id === layerId).groups[0]
        if (dependency[parentId]) {
          target[layerId] = true
        } else {
          target[layerId] = current
        }
      })
    return target
  }

  return (
    <div className={c("pb8 mb8", className)}>
      {withToolbar && (
        <div className={c("fbh fbac cfw2 pl8", s.toolbar)}>
          <div className="fb1 fbh fbac">
            <input type="text" placeholder="输入关键词进行搜索" />
            <IconButton
              icon="search"
              title="search"
              className="cfw8"
              // onClick={searchDatas}
            />
            <IconButton
              icon="add"
              className="cfw12"
              onClick={(e, button) => {
                e.stopPropagation()
                onAdd(e, button)
              }}
            />
          </div>
        </div>
      )}
      <GroupRender
        list={cloneDeep(value.source)}
        source={value.source}
        groups={value.groups}
        type={type}
        nameClassName={nameClassName}
        folds={isFolded}
        hides={isHided}
        focus={isFocused}
        disabled={isDisabled}
        buttons={buttons}
        onContextMenu={onContextMenu}
        onSelect={(id, isLayer) => {
          if (isLayer) {
            const {source} = value
            const focus = {}
            source
              .find((layer) => layer.id === id)
              .groups.forEach((groupId) => {
                focus[groupId] = true
              })
            focus[id] = true
            setIsFocused(focus)
          } else {
            setIsFocused({[id]: true})
          }
        }}
        onClick={onClick}
        onEyeClick={(id, isLayer, isVisible) => {
          if (!isLayer) {
            // 这部分代码可以等useEffeft函数优化好干掉，监听value变化
            const mapper = {}
            value.groups.forEach(
              (group) => (mapper[group.id] = !group.isVisible)
            )
            mapper[id] = !isVisible
            const disabled = getGroupScope(
              id,
              cloneDeep(isDisabled),
              mapper,
              !isVisible
            )
            setIsDisabled(disabled)
          }
          onEyeClick(id, isVisible)
        }}
        onFold={(groupId, folded) => {
          const folds = cloneDeep(isFolded)
          folds[groupId] = folded
          const hides = getGroupScope(
            groupId,
            cloneDeep(isHided),
            folds,
            folded
          )
          setIsFolded(folds)
          setIsHided(hides)
        }}
      />
    </div>
  )
}

export default observer(ConstructLayer)
