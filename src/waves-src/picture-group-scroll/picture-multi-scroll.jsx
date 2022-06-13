import React, {useState} from 'react'
import {types} from 'mobx-state-tree'
import {MUIBase} from '../ui-base'
import Scroll from '../../components/scroll'
import s from './picture.module.styl'

const myScrollPicture = MUIBase.named('myScrollPicture')
  .props({
    name: types.optional(types.string, '图片组-可滚动'),
    pictureData: types.optional(types.frozen(), {}),
  })
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'pictureGroupScroll'
    }

    // 传入数据
    const data = (pictureData) => {
      self.pictureData = pictureData.data
      self.name = pictureData.name || self.config('pictureName') || '可滚动图片组'
    }

    // 无数据或数据错误时，采用备用数据渲染
    const drawFallback = () => {
      self.draw({redraw: false})
    }

    // 和图表的方法保持一致
    const draw = ({redraw}) => {
      if (redraw === true) {
        self.removeNode(self.container?.parentNode)
      }

      const style = {
        height: self.config('containerHeight'),
        width: self.config('containerWidth'),
        color: self.config('fontColor'),
        fontSize: self.config('fontSize'),
        backgroundColor: self.config('backgroundColor'),
        border: `${self.config('borderWidth')}px solid ${self.config('borderColor')}`,
      }

      const RenderCom = (props) => {
        const {data, width, height, isMarkVisible} = props
        const [visible, setVisible] = useState(false) // 预览弹层
        const [currentClickIcon, setCurrentClickIcon] = useState(0)
        const [imageIndex, setDeliverImageIndex] = useState(0)
        const [clickNum, setClickNum] = useState(0) // 左右旋转方向
        const [scaleClickNum, setScaleClickNum] = useState(1) // 放大缩小
        const [eyePreviewIconTip, setEyePreviewIconTip] = useState(false)

        // 预览
        const handlPreview = (i) => {
          setVisible(true)
          setDeliverImageIndex(i)
        }

        return (
          <div>
            {/* 预览图：弹框遮罩层 */}
            {visible && (
              <div
                className={s.modalDiv}
                style={{
                  positon: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                }}
              >
                <div className={s.iconDiv}>
                  {/* 左旋转 */}
                  <span
                    className={s.modalIcon}
                    onClick={() => {
                      setCurrentClickIcon(1)
                      setClickNum(clickNum - 1)
                    }}
                  >
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="rotate-left"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <defs>
                        <style></style>
                      </defs>
                      <path d="M672 418H144c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32zm-44 402H188V494h440v326z"></path>
                      <path d="M819.3 328.5c-78.8-100.7-196-153.6-314.6-154.2l-.2-64c0-6.5-7.6-10.1-12.6-6.1l-128 101c-4 3.1-3.9 9.1 0 12.3L492 318.6c5.1 4 12.7.4 12.6-6.1v-63.9c12.9.1 25.9.9 38.8 2.5 42.1 5.2 82.1 18.2 119 38.7 38.1 21.2 71.2 49.7 98.4 84.3 27.1 34.7 46.7 73.7 58.1 115.8a325.95 325.95 0 016.5 140.9h74.9c14.8-103.6-11.3-213-81-302.3z"></path>
                    </svg>
                  </span>
                  {/* 右旋转 */}
                  <span
                    className={s.modalIcon}
                    onClick={() => {
                      setCurrentClickIcon(2)
                      setClickNum(clickNum + 1)
                    }}
                  >
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="rotate-right"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <defs>
                        <style></style>
                      </defs>
                      <path d="M480.5 251.2c13-1.6 25.9-2.4 38.8-2.5v63.9c0 6.5 7.5 10.1 12.6 6.1L660 217.6c4-3.2 4-9.2 0-12.3l-128-101c-5.1-4-12.6-.4-12.6 6.1l-.2 64c-118.6.5-235.8 53.4-314.6 154.2A399.75 399.75 0 00123.5 631h74.9c-.9-5.3-1.7-10.7-2.4-16.1-5.1-42.1-2.1-84.1 8.9-124.8 11.4-42.2 31-81.1 58.1-115.8 27.2-34.7 60.3-63.2 98.4-84.3 37-20.6 76.9-33.6 119.1-38.8z"></path>
                      <path d="M880 418H352c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32zm-44 402H396V494h440v326z"></path>
                    </svg>
                  </span>
                  {/* 缩小 */}
                  <span
                    className={s.modalIcon}
                    style={{
                      color: scaleClickNum === 1 && '#999',
                      pointerEvents: scaleClickNum === 1 && 'none',
                      cursor: scaleClickNum === 1 && 'not-allowed',
                    }}
                    onClick={() => {
                      setCurrentClickIcon(3)
                      scaleClickNum > 0 && setScaleClickNum(scaleClickNum - 1)
                    }}
                  >
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="zoom-out"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M637 443H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h312c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"></path>
                    </svg>
                  </span>
                  {/* 放大 */}
                  <span
                    className={s.modalIcon}
                    onClick={() => {
                      setCurrentClickIcon(4)
                      setScaleClickNum(scaleClickNum + 1)
                    }}
                  >
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="zoom-in"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"></path>
                    </svg>
                  </span>
                  {/* 关闭 */}
                  <span
                    className={s.modalIcon}
                    onClick={() => {
                      setVisible(false)
                      setClickNum(0)
                      setScaleClickNum(1)
                    }}
                  >
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="close"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                    </svg>
                  </span>
                </div>

                {data[imageIndex]?.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      width: '90%',
                      height: '90%',
                      background: `url(${v}) no-repeat`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      transform:
                        currentClickIcon === 1 || currentClickIcon === 2
                          ? `rotate(${clickNum * 90}deg)`
                          : currentClickIcon === 3 || currentClickIcon === 4
                          ? `scale(${scaleClickNum * 1})`
                          : '',
                    }}
                  />
                ))}
              </div>
            )}

            {/* 可滚动图片组 */}
            <div>
              {data.map((v, i) => (
                <div
                  key={i}
                  style={{
                    height: `${height}px`,
                    width: `${width}px`,
                    background: `url(${v}) no-repeat`,
                    backgroundSize: 'contain',
                  }}
                  onMouseEnter={() => setEyePreviewIconTip(true)}
                  onMouseLeave={() => setEyePreviewIconTip(false)}
                  onClick={() => isMarkVisible && handlPreview(i)}
                >
                  {/* 眼睛悬浮icon */}
                  {eyePreviewIconTip && (
                    <svg
                      t="1655110249346"
                      style={{
                        width: '2em',
                        height: '2em',
                        verticalAlign: 'middle',
                        fill: 'currentColor',
                        overflow: 'hidden',
                        position: 'relative',
                        top: 16,
                        left: width - 40,
                      }}
                      className={s.eyeIcon}
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2321"
                      data-spm-anchor-id="a313x.7781069.0.i5"
                    >
                      <path
                        d="M512 298.666667c-162.133333 0-285.866667 68.266667-375.466667 213.333333 89.6 145.066667 213.333333 213.333333 375.466667 213.333333s285.866667-68.266667 375.466667-213.333333c-89.6-145.066667-213.333333-213.333333-375.466667-213.333333z m0 469.333333c-183.466667 0-328.533333-85.333333-426.666667-256 98.133333-170.666667 243.2-256 426.666667-256s328.533333 85.333333 426.666667 256c-98.133333 170.666667-243.2 256-426.666667 256z m0-170.666667c46.933333 0 85.333333-38.4 85.333333-85.333333s-38.4-85.333333-85.333333-85.333333-85.333333 38.4-85.333333 85.333333 38.4 85.333333 85.333333 85.333333z m0 42.666667c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z"
                        fill="#ffffff"
                        p-id="2322"
                      ></path>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }

      // 渲染组件
      self.render(
        <div className="wh100p exhibit" style={{height: style.height, width: style.width}}>
          <Scroll className="h100p">
            <div style={{position: 'relative'}}>
              <div style={{display: 'flex', flexDirection: 'column', paddingTop: '10px'}}>
                <RenderCom
                  data={self.pictureData}
                  width={self.containerWidth}
                  height={self.containerHeight}
                  isMarkVisible={self.config('isMarkVisible')}
                />
              </div>
            </div>
          </Scroll>
        </div>
      )
    }

    return {
      data,
      draw,
      drawFallback,
      afterCreate,
    }
  })

export default myScrollPicture
