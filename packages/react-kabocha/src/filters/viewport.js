export default function filterViewport (el, index, arr) {
  return (
    el.type !== 'meta' ||
    el.props.name !== 'viewport' ||
    index ===
      arr.findIndex(
        item => item.type === 'meta' && item.props.name === 'viewport'
      )
  )
}
