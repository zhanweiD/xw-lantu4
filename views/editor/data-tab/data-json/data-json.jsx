import React from 'react'
import {observer} from 'mobx-react-lite'
import SectionFields from '@components/section-fields'
import Scroll from '@components/scroll'
import Button from '@components/button'
import Upload from '@components/upload'

const JsonData = ({data}) => {
  const {json} = data
  return (
    <Scroll className="h100p">
      <Upload accept=".json" onOk={(files) => json.loadFiles(files)} multiple={false}>
        <Button width={100} name="上传JSON文件" />
      </Upload>
      <SectionFields
        onChange={(options) => {
          json.onOptionsChange(options)
        }}
        model={json.codeOptions}
        hasPadding={false}
      />
    </Scroll>
  )
}

export default observer(JsonData)
