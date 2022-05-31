export default function isContainArray(parent, child) {
  return parent.join(',').indexOf(child.join(',')) !== -1
}
