import {reaction} from 'mobx'
import onerStorage from 'oner-storage'
import createLog from '@utils/create-log'
import random from '@utils/random'
import createEvent from '@utils/create-event'

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
    }

    init() {
      log.info(`组件(${this.model.lib}.${this.model.key})适配器实例执行了初始化init`)
      const instanceOption = this.getAllOptions()
      this.instance = hooks.init.call(this, {
        options: instanceOption,
      })
      this.observerModel()
    }

    getAllOptions() {
      this.layers = this.model.getLayers()
      const instanceOption = {
        container: this.container,
        layers: this.layers,
        ...this.model.context,
        padding: this.model.padding,
        ...this.size,
        isPreview: !this.isEdit,
      }
      if (this.model.data) {
        instanceOption.data = this.model.getData()
      }
      if (this.model.dimension) {
        instanceOption.dimension = this.model.getDimension()
      }
      return instanceOption
    }

    observerModel() {
      const {model} = this
      const {data, layers, dimension} = model
      if (data) {
        this.observerDisposers.push(
          reaction(
            () => model.data.value.toJSON(),
            () => {
              this.update({
                action: 'data',
                options: this.getAllOptions(),
                updatedData: this.model.getData(),
              })
            }
          )
        )
      }
      if (dimension) {
        this.observerDisposers.push(
          reaction(
            () => model.dimension.updatedOptions,
            () => {
              this.update({
                action: 'dimension',
                options: this.getAllOptions(),
                updatedDimension: model.dimension.updatedOptions,
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
              const options = this.model.getLayers()

              this.update({
                action: 'layer',
                options: this.getAllOptions(),
                updatedLayer: {
                  id: layer.id,
                  options: options.find((o) => o.id === layer.id),
                },
                updatedPath: layer.name,
              })
            }
          )
        )
        this.observerDisposers.push(
          reaction(
            () => layer.options.updatedOptions,
            () => {
              if (layer.effective) {
                this.update({
                  action: 'layer',
                  options: this.getAllOptions(),
                  updatedLayer: {
                    id: layer.id,
                    options: layer.options.updatedOptions,
                  },
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
                if (layer.effective) {
                  this.update({
                    action: 'layer',
                    options: this.getAllOptions(),
                    updatedLayer: {
                      id: layer.id,
                      options: {
                        data: layer.getData(),
                      },
                    },
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
      hooks.draw.call(this, {instance: this.instance})

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
      hooks.destroy.call(this, {instance: this.instance})
    }

    update({options, updatedData, updatedDimension, updatedLayer, action, updatedPath}) {
      hooks.update.call(this, {
        instance: this.instance,
        options,
        updatedData,
        updatedDimension,
        updatedLayer: this.model.addOptionUtil(updatedLayer),
        action,
        updatedPath,
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
