import React from 'react'
import {observer} from 'mobx-react-lite'
import Section from './section'
import ModelToField from './model-to-field'
import IconButton from '@components/icon-button'
import isDef from '@utils/is-def'
import {useTranslation} from 'react-i18next'
import w from '@models'
import {
  bimAmtn,
  bimWhite,
  geojson,
  heatMap,
  odLine,
  pointBreath,
  pointIcon,
  pointMuch,
  pointWave,
  tripLine,
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
  const {data, dimension, extra, gisBase, key, layers} = exhibit
  const {t} = useTranslation()
  const menu = w.overlayManager.get('menu')
  const menuList = [
    {
      name: '倾斜摄影层',
      action: () => {
        exhibit.addLayer([bimAmtn()])
        menu.hide()
      },
    },
    {
      name: '白盒模型层',
      action: () => {
        exhibit.addLayer([bimWhite()])
        menu.hide()
      },
    },
    {
      name: '图标层',
      action: () => {
        exhibit.addLayer([pointIcon()])
        menu.hide()
      },
    },
    {
      name: '呼吸点层',
      action: () => {
        exhibit.addLayer([pointBreath()])
        menu.hide()
      },
    },
    {
      name: '波纹点层',
      action: () => {
        exhibit.addLayer([pointWave()])
        menu.hide()
      },
    },
    {
      name: '海量点层',
      action: () => {
        exhibit.addLayer([pointMuch()])
        menu.hide()
      },
    },
    {
      name: 'OD线层',
      action: () => {
        exhibit.addLayer([odLine()])
        menu.hide()
      },
    },
    {
      name: 'GeoJSON层',
      action: () => {
        exhibit.addLayer([geojson()])
        menu.hide()
      },
    },
    {
      name: '热力层',
      action: () => {
        exhibit.addLayer([heatMap()])
        menu.hide()
      },
    },
    {
      name: '轨迹线层',
      action: () => {
        exhibit.addLayer([tripLine()])
        menu.hide()
      },
    },
    // {
    //   name: '飞线层',
    //   hideBtmBorder: true,
    //   action: () => {
    //     exhibit.setLayers([bimWhite()])
    //     menu.hide()
    //   },
    // }
  ]

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
                  !index ? null : (
                    <div className="fbh">
                      <IconButton icon="close" iconSize={14} buttonSize={24} onClick={() => exhibit.delLayer(index)} />
                    </div>
                  )
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

      {/* {key === 'gis' && (
        <div key={`${exhibit.id}.subLayers`}>
          <Section
            sessionId={`${exhibit.id}.subLayers`}
            type={0}
            name={t('subLayers')}
            key={t('subLayers')}
          >
            {layers.map((layer) => {
              return (
                <div key={layer.id}>
                  <Section
                    sessionId={`${layer.id}.${layer.name}`}
                    type={1}
                    name={layer.name}
                    key={layer.name}
                  >
                    {layer.data && <ModelToField model={layer.data} />}
                    {recusiveNode({
                      ...layer.options,
                    })}
                  </Section>
                </div>
              )
            })}
          </Section>
        </div>
      )} */}
    </>
  )
}

export default observer(Builder)
