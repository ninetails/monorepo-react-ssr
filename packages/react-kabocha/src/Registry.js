import { compose, filter, findLast, flatten, map } from 'lodash/fp'

const mapNoCap = map.convert({ cap: false })
const filterNoCap = filter.convert({ cap: false })

const addKey = mapNoCap((element, index) => ({ ...element, key: element.key || `head-${index}` }))
const filterByLastTitle = filterNoCap((el, index, arr) => el.type !== 'title' || el === findLast(item => item.type === 'title', arr))
const filterByLastViewport = filterNoCap((el, index, arr) => el.type !== 'meta' || el.props.name !== 'viewport' || el === findLast(item => item.type === 'meta', arr))
const filterByFirstCharSet = filterNoCap((el, index, arr) => el.type !== 'meta' || !el.props.charSet || el !== findLast(item => item.type === 'meta' && item.props.charSet, arr))

const transducer = compose(
  filterByFirstCharSet,
  filterByLastTitle,
  filterByLastViewport,
  addKey,
  flatten
)

class Registry {
  chunks = []

  add (chunk) {
    this.chunks = [...this.chunks, chunk]
  }

  remove (chunk) {
    this.chunks = this.chunks.filter(c => c !== chunk)
  }

  head () {
    return transducer(this.chunks)
  }
}

export function createRegistry (opts) {
  return new Registry(opts)
}

export default Registry
