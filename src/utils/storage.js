import onerStorage from 'oner-storage'
window.onerStorage = onerStorage
export const local = onerStorage({
  type: 'localStorage', // 缓存方式, 默认为'localStorage'
  key: 'waveview-front-local', // !!! 唯一必选的参数, 用于内部存储 !!!
  tag: 'v1.0', // 缓存的标记, 用于判断是否有效
  duration: 1000 * 60 * 60 * 24, // 缓存的有效期长, 以毫秒数指定
})

export const session = onerStorage({
  type: 'sessionStorage', // 缓存方式, 默认为'localStorage'
  key: 'waveview-front-session', // !!! 唯一必选的参数, 用于内部存储 !!!
})

export const createStorage = ({type, key}) => {
  const storage = onerStorage({
    type, // 缓存方式, 默认为'localStorage'
    key, // !!! 唯一必选的参数, 用于内部存储 !!!
  })
  return storage
}
