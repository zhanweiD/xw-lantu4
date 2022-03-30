import React from 'react'
import {observer} from 'mobx-react-lite'
import Section from './section'
import ModelToField from './model-to-field'
import IconButton from '@components/icon-button'
import isDef from '@utils/is-def'
import {useTranslation} from 'react-i18next'
import w from '@models'
import {newLayersInstance} from '@utils'
import {
  gisPoint,
  // gisIcon,
  // geojson,
  gisHeatmap,
  // odLine,
  // gisTile,
  // gisTerrain,
  // pointMuch,
  // pointWave,
  // tripLine,
} from '../waves4/waves/v3/gis/layers'

export const recusiveNode = ({sections, fields, level = 1}) => {
  if (level > 2) return

  return (
    <>
      {fields && Object.entries(fields).map(([key, field]) => <ModelToField model={field} key={key} />)}
      {sections &&
        Object.values(sections).map((node) => {
          let fields = node.fields
          let subSections = node.sections
          return (
            <Section
              titleClassName="pr8"
              sessionId={node.name}
              type={level}
              name={node.name}
              key={node.name}
              headIcon={
                isDef(node.effective) && (
                  <IconButton
                    className="ml4"
                    icon={node.effective ? 'eye-open' : 'eye-close'}
                    iconSize={14}
                    buttonSize={18}
                    onClick={node.toggleEffective}
                  />
                )
              }
            >
              {isDef(fields) && Object.entries(fields).map(([key, field]) => <ModelToField model={field} key={key} />)}
              {isDef(subSections) && recusiveNode({sections: subSections, level: level + 1})}
            </Section>
          )
        })}
    </>
  )
}

const Builder = ({exhibit}) => {
  const {data, dimension, extra, gisBase, key, layers, adapter} = exhibit
  const {instance} = adapter || {}

  const {t} = useTranslation()
  const menu = w.overlayManager.get('menu')
  const menuList = [
    {
      name: '散点气泡层',
      action: () => {
        // const option = gisPoint()
        // const pointLayer = new PointLayer({
        //   ...config,
        //   data: getRealData(option.data),
        // })
        // option.instanceLayer = pointLayer
        exhibit.addLayer([gisPoint()])
        adapter.instance?.updateProps({layers: newLayersInstance(instance, exhibit.layers)})
        menu.hide()
      },
    },
    // {
    //   name: '符号层',
    //   action: () => {
    //     exhibit.addLayer([gisIcon()])
    //     menu.hide()
    //   },
    // },
    // {
    //   name: '地形层',
    //   action: () => {
    //     exhibit.addLayer([gisTerrain()])
    //     menu.hide()
    //   },
    // },
    // {
    //   name: '模型层',
    //   action: () => {
    //     exhibit.addLayer([gisTile()])
    //     menu.hide()
    //   },
    // },
    // {
    //   name: '波纹点层',
    //   action: () => {
    //     exhibit.addLayer([pointWave()])
    //     menu.hide()
    //   },
    // },
    // {
    //   name: '海量点层',
    //   action: () => {
    //     exhibit.addLayer([pointMuch()])
    //     menu.hide()
    //   },
    // },
    // {
    //   name: '飞线层',
    //   action: () => {
    //     exhibit.addLayer([odLine()])
    //     adapter.instance?.updateProps({layers: newLayersInstance(instance, exhibit.layers)})
    //     menu.hide()
    //   },
    // },
    // {
    //   name: 'GeoJSON层',
    //   action: () => {
    //     exhibit.addLayer([geojson()])
    //     menu.hide()
    //   },
    // },
    {
      name: '热力层',
      action: () => {
        exhibit.addLayer([gisHeatmap()])
        adapter.instance?.updateProps({layers: newLayersInstance(adapter.instance, exhibit.layers)})
        menu.hide()
      },
    },
    // {
    //   name: '轨迹线层',
    //   action: () => {
    //     exhibit.addLayer([tripLine()])
    //     menu.hide()
    //   },
    // },
  ]
  const delLayer = (layer) => {
    exhibit.delLayer(layer)
    adapter.instance?.updateProps({layers: newLayersInstance(adapter.instance, exhibit.layers, true)})
  }

  // 子层列表在这加
  return (
    <>
      {data && <ModelToField model={data} />}
      {dimension && (
        <Section sessionId={`${exhibit.id}.dimension`} type={0} name={t('dimension')} key={t('dimension')}>
          {recusiveNode({
            ...dimension.options,
          })}
        </Section>
      )}
      {key === 'gis' && (
        <div key={`${exhibit.id}.gisBase`}>
          <Section
            sessionId={`${exhibit.id}.gisBase`}
            type={0}
            name={t('gisBase')}
            key={t('gisBase')}
            extra={
              <div className="fbh cf4">
                <IconButton
                  icon="add"
                  iconSize={14}
                  buttonSize={24}
                  onClick={() => {
                    menu.show({list: menuList})
                  }}
                />
              </div>
            }
          >
            {recusiveNode({
              ...gisBase.options,
            })}
          </Section>
        </div>
      )}
      {layers.map((layer, index) => {
        return (
          <div key={layer.id}>
            <Section
              sessionId={`${layer.id}.${layer.name}`}
              type={0}
              name={key === 'gis' ? `GIS图层${index + 1}（${layer.name}）` : layer.name}
              key={layer.name}
              extra={
                key === 'gis' ? (
                  <div className="fbh">
                    <IconButton
                      icon="close"
                      iconSize={14}
                      buttonSize={24}
                      onClick={() => {
                        delLayer(layer)
                      }}
                    />
                  </div>
                ) : (
                  <div className="fbh">
                    <IconButton
                      icon={layer.effective ? 'eye-open' : 'eye-close'}
                      iconSize={14}
                      buttonSize={24}
                      onClick={layer.toggleEffective}
                    />
                    {extra}
                  </div>
                )
              }
            >
              {layer.data && <ModelToField model={layer.data} />}
              {recusiveNode({
                ...layer.options,
              })}
            </Section>
          </div>
        )
      })}
    </>
  )
}

export default observer(Builder)
