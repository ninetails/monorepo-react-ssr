export default function filterCharSet (el, index, arr) {
  return (
    el.type !== 'meta' ||
    !el.props.charSet ||
    index === arr.findIndex(item => item.type === 'meta' && item.props.charSet)
  )
}
