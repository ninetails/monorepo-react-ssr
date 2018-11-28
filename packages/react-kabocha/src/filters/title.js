export default function filterTitle (el, index, arr) {
  return (
    el.type !== 'title' ||
    index === arr.findIndex(item => item.type === 'title')
  )
}
