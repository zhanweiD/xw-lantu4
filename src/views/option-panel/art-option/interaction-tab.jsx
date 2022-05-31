import {observer} from 'mobx-react-lite'
import React from 'react'
import {useTranslation} from 'react-i18next'
import fields from '@builders/fields'
import {Interaction} from '@views/public/interaction'

const {TextField} = fields

const InteractionTab = ({exhibit, containerInfo}) => {
  // const {key} = exhibit
  const {name} = containerInfo
  const {t} = useTranslation()
  return (
    <div className="interaction-box">
      <TextField className="ml24 mt8" label={t('interactionTarget')} value={name} />
      {/* {['button', 'uiTabButton'].includes(key) && <Interaction model={exhibit.interaction} />} */}
      <Interaction model={exhibit.interaction} />
    </div>
  )
}

export default observer(InteractionTab)
