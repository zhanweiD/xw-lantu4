import {reaction} from 'mobx'

import createLog from '@utils/create-log'
import isDef from '@utils/is-def'
import createEvent from '@utils/create-event'
import onerStorage from 'oner-storage'
import addOptionMethod from '@utils/add-option-method'

const log = createLog('@exhibit-adapter-creater')

const createExhibitAdapter = (hooks) =>
  class Adapter {
    // 内置的hook名称
    static frozenHookNames = [
      'init',
      'update',
      'data',
      'draw',
      'destroy',
      'getStyle',
      'getData',
      'preview',
      'warn',
      'event',
    ]

    static draw({container, height, width, model, box, isEdit}) {
      model.setAdapter(
        new Adapter({
          container,
          height,
          width,
          model,
          box,
          isEdit,
          staticDrawOptions: {container, height, width, model, box, isEdit},
        })
      )

      model.adapter.init()
    }

    constructor({container, height, width, model, isEdit, staticDrawOptions}) {
      this.container = container
      this.size = {
        width,
        height,
      }
      this.model = model
      this.isEdit = isEdit
      this.staticDrawOptions = staticDrawOptions
      this.event = createEvent(`${this.model.lib}.${this.model.key}.adapter`)
      this.observerDisposers = []
      // 添加hooks上定义的适配器方法
      Object.entries(hooks).forEach(([propName, prop]) => {
        if (Adapter.frozenHookNames.indexOf(propName) > -1) {
          return
        }
        this[propName] = prop
      })
      this.ruleValue = undefined
      this.ready = false

      // 配置项的路径获取工具和对应的数据，输入到hooks方法内，方便对接者使用
      this.pathable = onerStorage({
        type: 'variable',
        key: `exhibit-options-${this.model.id}`, // !!! 唯一必选的参数, 用于内部存储 !!!
      })
    }

    init() {
      log.info(`组件(${this.model.lib}.${this.model.key})适配器实例执行了初始化init`)
      const instanceOption = this.getAllOptions()

      this.instance = hooks.init.call(null, {
        options: instanceOption,
      })
      this.observerModel()
    }

    getAllOptions() {
      const instanceOption = {
        container: this.container,
        layers: this.model.getLayers(),
        title: addOptionMethod(this.model.getTitle()),
        legend: addOptionMethod(this.model.getLegend()),
        other: addOptionMethod(this.model.getOther()),
        axis: addOptionMethod(this.model.getAxis()),
        data: this.model.getData(),
        dimension: this.model.getDimension(),
        ...this.model.context,
        padding: this.model.padding,
        ...this.size,
        isPreview: !this.isEdit,
      }

      return instanceOption
    }

    createObserverObject({actionType, isGlobal = false}) {
      return reaction(
        () => (isGlobal ? this.model[actionType].effective : this.model[actionType].options.updatedOptions),
        () => {
          const map = {
            legend: 'updatedLegend',
            title: 'updatedTitle',
            other: 'updatedOther',
            axis: 'updatedAxis',
            dimension: 'updatedDimension',
            // layer: 'updatedLayer',
          }
          console.log('🚗🚗')
          const action = () =>
            this.update({
              action: actionType,
              options: this.getAllOptions(),
              [map[actionType]]: isGlobal
                ? this.model[actionType].getData()
                : this.model[actionType].options.updatedOptions,
              updated: isGlobal ? this.model[actionType].getData() : this.model[actionType].options.updatedOptions,
              updatedPath: isGlobal ? 'effective' : this.model[actionType].options.updatedPath,
            })
          if (!isGlobal) {
            if (!isDef(this.model[actionType].effective) || this.model[actionType].effective) {
              action()
            }
          } else {
            action()
          }
        }
      )
    }

    observerModel() {
      const {model} = this
      const {data, layers, dimension, title, legend, axis, other} = model
      if (legend) {
        this.observerDisposers.push(
          this.createObserverObject({actionType: 'legend', isGlobal: true}),
          this.createObserverObject({actionType: 'legend'})
        )
      }
      if (title) {
        this.observerDisposers.push(
          this.createObserverObject({actionType: 'title', isGlobal: true}),
          this.createObserverObject({actionType: 'title'})
        )
      }
      if (dimension) {
        this.observerDisposers.push(this.createObserverObject({actionType: 'dimension'}))
      }
      if (axis) {
        this.observerDisposers.push(
          this.createObserverObject({actionType: 'axis', isGlobal: true}),
          this.createObserverObject({actionType: 'axis'})
        )
      }
      if (other) {
        this.observerDisposers.push(
          this.createObserverObject({actionType: 'other', isGlobal: true}),
          this.createObserverObject({actionType: 'other'})
        )
      }

      if (data) {
        this.observerDisposers.push(
          reaction(
            () => model.data.value.toJSON(),
            () => {
              const updated = model.getData()
              this.update({
                action: 'data',
                options: this.getAllOptions(),
                updatedData: updated,
                updated,
              })
            }
          )
        )
      }
      layers.map((layer) => {
        this.observerDisposers.push(
          reaction(
            () => layer.effective,
            () => {
              const options = model.getLayers()
              const updated = {
                id: layer.id,
                type: layer.type,
                options: options.find((o) => o.id === layer.id),
              }
              this.update({
                action: 'layer',
                options: this.getAllOptions(),
                updatedLayer: updated,
                updated,
                updatedPath: 'effective',
              })
            }
          )
        )
        this.observerDisposers.push(
          reaction(
            () => layer.options.updatedOptions,
            () => {
              if (layer.effective) {
                const updated = {
                  id: layer.id,
                  type: layer.type,
                  options: layer.options.updatedOptions,
                }
                this.update({
                  action: 'layer',
                  options: this.getAllOptions(),
                  updatedLayer: updated,
                  updated,
                  updatedPath: layer.options.updatedPath,
                })
              }
            }
          )
        )
        if (layer.data) {
          this.observerDisposers.push(
            reaction(
              () => layer.data.value.toJSON(),
              () => {
                const updated = {
                  id: layer.id,
                  options: {
                    data: layer.getData(),
                  },
                }
                if (layer.effective) {
                  this.update({
                    action: 'layer',
                    options: this.getAllOptions(),
                    updatedLayer: updated,
                    updated,
                    updatedPath: 'data',
                  })
                }
              }
            )
          )
        }
      })
    }

    stopObserverModel() {
      this.observerDisposers.forEach((disposer) => disposer())
    }

    setRuleValue({ruleValue, lastUpdateTime}) {
      this.ruleValue = ruleValue
      this.ruleValueLastUpdateTime = lastUpdateTime
    }

    draw() {
      hooks.draw.call(null, {instance: this.instance})

      // 触发首次加载完成事件，和交互规则的“加载后触发一次”相对应
      if (this.ready === false) {
        this.ready = true
        this.event.fire('ready')
      }
    }

    destroy() {
      log.info(`Exhibit adapter('${this.model.key}') destroy`)
      // 停止配置项的监听
      // 清空适配器实例对象的事件
      this.event.clear()
      this.stopObserverModel()
      // 调用原实例对象的销毁方法
      hooks.destroy.call(null, {instance: this.instance})

      // 销毁配置项的路径获取工具和对应的数据
      this.pathable.destroy()
    }

    update({
      options,
      updatedData,
      updatedDimension,
      updatedLayer,
      action,
      updated,
      updatedPath,
      updatedTitle,
      updatedLegend,
      updatedOther,
      updatedAxis,
    }) {
      hooks.update.call(null, {
        instance: this.instance,
        options,
        updatedData,
        updatedDimension,
        updatedLayer: addOptionMethod(updatedLayer),
        action,
        updated,
        updatedPath,
        updatedTitle: addOptionMethod(updatedTitle),
        updatedLegend: addOptionMethod(updatedLegend),
        updatedOther: addOptionMethod(updatedOther),
        updatedAxis: addOptionMethod(updatedAxis),
      })
    }

    refresh(width, height) {
      this.destroy()
      setTimeout(() => {
        if (width && height) {
          this.staticDrawOptions.width = width
          this.staticDrawOptions.height = height
        }
        Adapter.draw(this.staticDrawOptions)
      }, 40)
    }
  }

export default createExhibitAdapter
