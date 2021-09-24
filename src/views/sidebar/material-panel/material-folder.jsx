import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import Section from '@components/section'
import Grid from '@components/grid'
import Modal from '@components/modal'
import Scroll from '@components/scroll'
import Upload from '@components/upload'
import Geo from '@components/geo-preview'
import Icon from '@components/icon'
import IconButton from '@components/icon-button'
import Material from './material-thumbnail'
import s from './material-panel.module.styl'

const MaterialFolder = ({folder, showType, icon}) => {
  const {materials_, isOfficial, files} = folder
  const thumbs = files.map((file, index) => {
    let F
    switch (file.fileType) {
      case 'image':
        F = <img src={file.preview} className={c('inlineBlock', s.previewImg)} alt="" />
        break
      case 'GeoJSON':
        F = <Geo path={file.preview} />
        break
      default:
        null
    }
    return (
      <div key={`${file.preview}.${index}`} className={c(s.thumb, 'fbh fbjc fbac pr mb30')}>
        {F}
        <IconButton
          icon="close"
          iconSize={16}
          onClick={() => folder.removeMaterial(index)}
          className={c('pa', s.removeButton)}
        />
      </div>
    )
  })

  return (
    <Section
      icon={icon}
      childrenClassName="pt8 pb8"
      name={`${folder.folderName}(${folder.materials.length})`}
      sessionId={`material-folder-${folder.folderId}`}
      updateKey={showType}
    >
      {materials_.length === 0 && (
        <div className={c('mb16 emptyNote mr8 ml8')}>
          <span>素材列表还是空空的</span>
          {!isOfficial && (
            <span>
              ，点击
              <span className="ctSecend hand" onClick={() => folder.set({isVisible: true})}>
                上传
              </span>
            </span>
          )}
        </div>
      )}
      {showType === 'grid-layout' ? (
        <Grid column={4} className="mr8 ml8">
          {materials_.map((material) => (
            <Grid.Item key={material.materialId}>
              <Material key={material.materialId} material={material} showType={showType} />
            </Grid.Item>
          ))}
        </Grid>
      ) : (
        materials_.map((material) => <Material key={material.materialId} material={material} showType={showType} />)
      )}
      <Modal
        title="上传素材"
        height={500}
        width={800}
        hasMask
        isVisible={folder.isVisible}
        onClose={() => folder.resetUpload()}
        buttons={[
          {name: '取消', action: () => folder.resetUpload()},
          {name: '上传', action: () => folder.uploadMaterial()},
        ]}
      >
        <div className="fbv h100p">
          <section className="fbh h100p p16 m16">
            <aside className={c('fbv h100p fb1 mr16', s.preview)}>
              <div className="lh32">预览({files.length})</div>
              <div className={c('f1', s.thumbs)}>
                <Scroll>{thumbs}</Scroll>
              </div>
            </aside>
            <aside>
              <Upload
                placeholder="将需要上传的内容拖入下面的区域，或者直接点击选择文件(GeoJson、图片，限5份/次))"
                accept=".json, .geojson, image/*"
                onOk={folder.addMaterial}
              >
                <div className={c('fbh fbac fbjc', s.uploadArea)}>
                  <Icon name="upload" size={64} opacity={0.3} />
                </div>
              </Upload>
            </aside>
          </section>
        </div>
      </Modal>
    </Section>
  )
}

export default observer(MaterialFolder)
