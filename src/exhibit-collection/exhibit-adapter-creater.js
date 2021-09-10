import createLog from '@utils/create-log'
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
      // this.data = this.model.getData()
      this.layers = this.model.getLayers()

      const instanceOption = {
        container: this.container,

        layers: this.layers,

        ...this.model.context,
        padding: this.model.padding,
        ...this.size,
        isPreview: !this.isEdit,
      }
      console.log(instanceOption)
      this.instance = hooks.init.call(this, instanceOption)
      // this.instance.event.once('ready', () => {
      //   this.event.fire('ready')
      // })
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
      // 调用原实例对象的销毁方法
      hooks.destroy.call(this, {instance: this.instance})
    }

    update({tabId, layerId, option, value, schema, totalValue, action}) {
      hooks.update.call(this, {
        instance: this.instance,
        tabId,
        layerId,
        option,
        value,
        schema,
        totalValue,
        action,
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
