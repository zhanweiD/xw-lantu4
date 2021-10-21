import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import {local} from '@utils/storage'
import uuid from '@utils/uuid'
import en from './en'
import zh from './zh-cn'

// 默认语言
// TODO: 后续对接到配置面板
const defaultLanguage = 'zh-CN'
// 初始化
// https://react.i18next.com/latest/using-with-hooks
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    'zh-CN': {
      translation: zh,
    },
  },
  lng: local.get('lang'),
  fallbackLng: defaultLanguage,
  debug: false,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
})
// 当用户切换语言时，同步到缓存中
i18n.on('languageChanged', (lang) => {
  local.set('lang', lang)
})

// 多语言沙盒
// NOTE: 二开的组件和工具扩展的多语言，不应该应该工具自身的语言
//
// 示例：
//
// const lang = i18n.sandbox({
//   sankey: ['桑基图', 'Sankey'],
//   base: ['基础', 'Base'],
//   direction: ['方向', 'Direction'],
//   horizontal: ['水平', 'Horizontal'],
//   vertical: ['水平', 'Vertical'],
//   node: ['节点', 'Node'],
//   link: ['连线', 'Link'],
// })
//
// lang('base') // 根据全局语言环境，返回'基础'或'Base'
i18n.sandbox = (lang, id) => {
  // debugger
  const ns = id || uuid()
  // 添加语言
  Object.entries(lang).forEach((item) => {
    const [key, l] = item

    i18n.addResources('zh-CN', ns, {
      [key]: l[0],
    })

    i18n.addResources('en', ns, {
      [key]: l[1],
    })
  })

  // return key => i18n.t(`${ns}:${key}`)
  return (key) => `${ns}:${key}`
}

// 三种场景下的使用标准

// Hook Comomponent上下文的使用场景
// import {useTranslation} from 'react-i18next'
// const EditorTab = observer(() => {
//   const {t} = useTranslation()
//   return <div>{t('xxx')}</div>
// })

// 普通js上下文的使用方法
// import w from '@models'
// const {i18n} = w
// i18n.t('xxx')

// 模型上下文的使用方法：getEnv(self).i18n.t('xxx')
// .views(self => ({
//   get name() {
//     return self.art ? self.art.name : getEnv(self).i18n.t('untitledArt')
//   }
// }))
export default i18n
