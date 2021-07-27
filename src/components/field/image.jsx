import React, {useState, useEffect} from "react"
import {observer} from "mobx-react-lite"
import trim from "lodash/trim"
import c from "classnames"
import createLog from "@utils/create-log"
import Icon from "@components/icon"
import Grid from "@components/grid"
import {Field} from "./base"
import s from "./image.module.styl"
// import Loading from '../loading'

const log = createLog(__filename)

export const ImageField = observer(
  ({
    label,
    tip,
    value,
    onChange,
    className,
    options,
    opacity = 1,
    getAspectRatio = () => {}
  }) => {
    const [isLoadSuccess, setIsLoadSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // 图片预处理
    const loadImage = (imageSrc) => {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = imageSrc
        // 如果图片已经存在于浏览器缓存，直接调用回调函数
        if (image.complete) {
          resolve(image)
          // 直接返回，不用再处理onload事件
          return
        }
        // 加载成功
        image.onload = () => {
          resolve(image)
        }
        // 加载失败
        image.onerror = () => {
          reject(new Error("图片加载错误"))
        }
      })
    }
    // 验证图片地址是否有效
    useEffect(() => {
      setIsLoading(true)
      if (trim(value)) {
        loadImage(value)
          .then((image) => {
            setIsLoading(false)
            if (image.fileSize > 0 || (image.width > 0 && image.height > 0)) {
              getAspectRatio(image.height / image.width)
              setIsLoadSuccess(true)
            }
          })
          .catch((error) => {
            setIsLoading(false)
            setIsLoadSuccess(false)
            getAspectRatio(undefined)
            log.error(error)
          })
      } else {
        setIsLoading(false)
        setIsLoadSuccess(false)
        getAspectRatio(undefined)
      }
    }, [value])

    const materialSelectModal = window.waveview.overlayManager.get("modal")

    return (
      <Field label={label} className={className} tip={tip}>
        <div className={c("cfw10 pr w100p", s.container)}>
          <div
            className={c("pa fbh fbac fbjc", s.imageArea, {
              [s.selectHover]: !value
            })}
            style={{
              opacity,
              backgroundImage: `url(${!isLoading && isLoadSuccess && value})`
            }}
            onClick={(e) => {
              e.stopPropagation()
              materialSelectModal.show({
                title: "素材选择",
                attachTo: false,
                height: 500,
                content: (
                  <Grid column={4}>
                    {options.map((item) => (
                      <Grid.Item key={item.key}>
                        {/* Caption 父级元素trasnform下，fixed定位根据父容器 */}
                        {/* <Caption content={item.name}> */}
                        <div
                          className={c("pa fbh fbjc fbae", s.image)}
                          style={{backgroundImage: `url(${item.value})`}}
                          onDoubleClick={() => {
                            onChange(item.value)
                            materialSelectModal.hide()
                          }}
                        >
                          <div className={s.label}>{item.name}</div>
                        </div>
                        {/* </Caption> */}
                      </Grid.Item>
                    ))}
                  </Grid>
                )
              })
            }}
          >
            {!isLoading && !isLoadSuccess && "选择素材"}
          </div>
          {value && (
            <div
              className={c("pa fbh fbac fbjc", s.close)}
              onClick={() => onChange(undefined)}
            >
              <Icon name="close" size={8} />
            </div>
          )}
        </div>
        {/* Loading 待优化 */}
        {/* {trim(value) !== '' && <Loading data={isLoading ? 'loading' : isLoadSuccess ? 'loadSuccess' : 'loadError'} />} */}
        {/* {!isLoading && !isLoadSuccess && trim(value) !== '' && <div className={c('p8', s.errorTip)}>图片加载失败！</div>} */}
      </Field>
    )
  }
)
