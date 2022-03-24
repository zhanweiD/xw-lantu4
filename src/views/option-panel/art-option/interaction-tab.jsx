import {observer} from 'mobx-react-lite'
import React from 'react'
import {useTranslation} from 'react-i18next'
import fields from '@builders/fields'
import {ButtonInteraction} from '@views/public/interaction'

const {TextField} = fields

const InteractionTab = ({exhibit, containerInfo}) => {
  console.log('exhibit', exhibit)
  console.log('containerInfo', containerInfo)
  const {key} = exhibit
  const {name} = containerInfo
  const {t} = useTranslation()
  return (
    <div className="interaction-box">
      <TextField className="ml24 mt8" label={t('interactionTarget')} value={name} />
      {key === 'button' && <ButtonInteraction model={exhibit.interaction} />}
    </div>
  )
}

export default observer(InteractionTab)
