const createRenderChunk = ({ assetsByChunkName } = {}) => fn => {
  function renderChunk (chunk, key = '') {
    if (!chunk) {
      return null
    }

    if (typeof chunk === 'string') {
      return fn(chunk, key)
    }

    if (Array.isArray(chunk)) {
      return chunk
        .filter(path => !/\.map$/.test(path))
        .map((curr, i) => renderChunk(curr, key ? `${key}-${i}` : i))
    }

    const objectChunksArray = Object.keys(chunk)
      .reduce((acc, chunkName) => {
        const chunks = renderChunk(chunk[chunkName], chunkName)

        return Array.isArray(chunks) ? acc.concat(chunks) : [...acc, chunks]
      }, [])

    return objectChunksArray.length > 1
      ? objectChunksArray
      : objectChunksArray.pop()
  }

  return renderChunk(assetsByChunkName)
}

export default createRenderChunk
