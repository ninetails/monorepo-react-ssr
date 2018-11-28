import filterUniques from './filters'

function extractHeadTags (
  registry,
  additionalFilters = [],
  filters = filterUniques
) {
  return filters
    .concat(additionalFilters)
    .reduce(
      (prev, fn) => prev.filter(fn),
      registry.reduce((acc, tags) => acc.concat(tags), []).reverse()
    )
    .reverse()
    .map((element, index) => ({
      ...element,
      key: element.key || `head-${index}`
    }))
}

extractHeadTags.filters = filterUniques

export default extractHeadTags
