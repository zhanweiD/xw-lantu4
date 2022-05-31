const name = window.location.pathname.split('/')[1]

const isEdit = !(
  name === 'waveview' ||
  name === 'preview' ||
  name === 'publish' ||
  name.indexOf('invest_research_integration') > -1
)

export default isEdit
