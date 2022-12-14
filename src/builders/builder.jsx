import React from 'react'
import {observer} from 'mobx-react-lite'
import Section from './section'
import ModelToField from './model-to-field'
import IconButton from '@components/icon-button'
import isDef from '@utils/is-def'
import {useTranslation} from 'react-i18next'
import w from '@models'
import {newLayersInstance} from '@utils'
import {gisPoint, gisIcon, geojson, gisHeatmap, odLine, gisTile, gisTerrain, gisPath} from '../waves4/waves/gis/layers'
// import {newLayersInstance, getRealData} from '@utils'
// import {PointLayer} from 'wave-map-test'

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

// const animate = (pointLayer, cb) => {
//   setTimeout(() => {
//     console.log(pointLayer)
//     pointLayer.setDiskResolution((Math.random() * 12).toFixed(0) - 0 + 2)
//     pointLayer.setElevationValue((Math.random() * 5000).toFixed(0) - 0 + 2)
//     cb()
//     animate()
//   }, 10000)
// }

const Builder = ({layers, data, dimension, exhibit, extra, gisBase}) => {
  const {key, adapter} = exhibit
  const {instance} = adapter || {}
  const {t} = useTranslation()
  const menu = w.overlayManager.get('menu')

  const addLayer = (layerOption) => {
    exhibit.addLayer(layerOption)
    adapter.instance?.updateProps({layers: newLayersInstance(instance, exhibit.layers)})
    menu.hide()
  }
  const menuList = [
    {
      name: '???????????????',
      action: () => {
        // const option = gisPoint()
        // const pointLayer = new PointLayer({
        //   earth: instance,
        //   label: true,
        //   data: getRealData(option.data),
        // })
        // option.instanceLayer = pointLayer
        // exhibit.addLayer([option])
        // adapter.instance?.updateProps({layers: exhibit.layers.map(item => item.instanceLayer_.getLayers())})
        // menu.hide()
        addLayer([gisPoint()])
      },
    },
    {
      name: '?????????',
      action: () => addLayer([gisIcon()]),
    },
    {
      name: '?????????',
      action: () => addLayer([gisTerrain()]),
    },
    {
      name: '?????????',
      action: () => addLayer([gisTile()]),
    },
    {
      name: '?????????',
      action: () => addLayer([odLine()]),
    },
    {
      name: '?????????',
      action: () => addLayer([geojson()]),
    },
    {
      name: '?????????',
      action: () => addLayer([gisHeatmap()]),
    },
    {
      name: '????????????',
      action: () => addLayer([gisPath()]),
    },
  ]
  const delLayer = (layer) => {
    exhibit.delLayer(layer)
    adapter.instance?.updateProps({layers: newLayersInstance(adapter.instance, exhibit.layers, true)})
  }

  // ?????????????????????
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
              name={key === 'gis' ? `GIS??????${index + 1}???${layer.name}???` : layer.name}
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
