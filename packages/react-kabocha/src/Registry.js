import React, { useLayoutEffect, useState } from 'react'
import { compose, filter, findLast, flatten, map } from 'lodash/fp'
import domNodeToReactNode from './domNodeToReactNode'
import HeadPortal from './HeadPortal'

const NODE_TYPE_ELEMENT_NODE = 1

const mapNoCap = map.convert({ cap: false })
const filterNoCap = filter.convert({ cap: false })

const addKey = mapNoCap((element, index) => ({ ...element, key: element.key || `head-${index}` }))
const filterByLastTitle = filterNoCap((el, index, arr) => el.type !== 'title' || el === findLast(item => item.type === 'title', arr))
const filterByLastViewport = filterNoCap((el, index, arr) => el.type !== 'meta' || el.props.name !== 'viewport' || el === findLast(item => item.type === 'meta', arr))
const filterByFirstCharSet = filterNoCap((el, index, arr) => el.type !== 'meta' || !el.props.charSet || el !== findLast(item => item.type === 'meta' && item.props.charSet, arr))

const defaultTransducer = compose(
  addKey,
  filterByFirstCharSet,
  filterByLastTitle,
  filterByLastViewport,
  flatten
)

class Registry {
  chunks = []

  getEffect = () => this.isClient()
    ? useLayoutEffect
    : () => undefined

  constructor ({
    isClient = () => !!global.window,
    filterHeadTags = tag => !['script', 'style'].includes(tag.tagName),
    transducer = defaultTransducer
  } = {}) {
    this.isClient = isClient
    this.filterHeadTags = filterHeadTags
    this.transducer = transducer
  }

  add (chunk) {
    this.chunks = [...this.chunks, chunk]
  }

  remove (chunk) {
    this.chunks = this.chunks.filter(c => c !== chunk)
  }

  head = () =>
    this.transducer(this.chunks)

  useHeadInit = () => {
    this.state = useState()

    const [tags] = this.state

    const useEffect = this.getEffect()

    useEffect(() => {
      if (!tags) {
        const nodes = compose(
          filter(this.filterHeadTags),
          filter(el => el.nodeType === NODE_TYPE_ELEMENT_NODE)
        )([...global.window.document.head.childNodes])

        this.add(map(domNodeToReactNode)(nodes))
        nodes.forEach(node => node.parentNode.removeChild(node))
      }
    })
  }

  useHeadRegistry = tags => {
    const [, setTags] = this.state
    this.add(tags)

    const useEffect = this.getEffect()

    useEffect(() => {
      setTags(this.head())

      return () => {
        this.remove(tags)

        setTags(this.head())
      }
    })
  }

  RenderPortal = () => this.isClient()
    ? <HeadPortal>{this.state[0]}</HeadPortal>
    : null
}

export function createRegistry (opts) {
  return new Registry(opts)
}

export default Registry
