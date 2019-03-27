import * as React from 'react'

type ChunkCollection =
  | undefined
  | string
  | string[]
  | { [name: string]: ChunkCollection }

type CreateRenderChunksArgs = {
  assetsByChunkName?: ChunkCollection;
}

export type RenderElementFn = (chunk: string, key: string) => JSX.Element

type RenderChunksOptions = {
  blacklist?: RegExp,
  whitelist?: RegExp,
  chunks?: string[]
}

function renderChunkUsingFn(
  fn: RenderElementFn,
  chunk: ChunkCollection,
  opts: RenderChunksOptions = {},
  key?: string
): JSX.Element | JSX.Element[] | null {
  if (!chunk) {
    return null
  }

  if (typeof chunk === 'string') {
    const { blacklist = /\.map$/, whitelist } = opts

    if (blacklist.test(chunk)) {
      return null
    }

    if (whitelist && !whitelist.test(chunk)) {
      return null
    }

    return fn(chunk, key || chunk)
  }

  const rawList: JSX.Element[] = Array.isArray(chunk)
    ? chunk.flatMap((value, index) => renderChunkUsingFn(fn, value, opts, key ? `${key}-${index}` : `${index}`) as JSX.Element | JSX.Element[])
    : Object.entries(chunk).flatMap(([chunkName, value]) => {
      if (Array.isArray(opts.chunks) && opts.chunks.length > 0 && !opts.chunks.includes(chunkName)) {
        return []
      }

      return renderChunkUsingFn(fn, value, opts, chunkName) as JSX.Element | JSX.Element[]
    })

  const filtered = rawList.filter(x => !!x)

  if (!filtered.length) {
    return null
  }

  return filtered
}

function createRenderChunks({
  assetsByChunkName
}: CreateRenderChunksArgs = {}) {
  return function callRenderChunk(fn: RenderElementFn, opts: RenderChunksOptions = {}) {
    return renderChunkUsingFn(fn, assetsByChunkName, opts)
  }
}

export type RenderChunk = (fn: RenderElementFn) => JSX.Element | JSX.Element[] | null

export default createRenderChunks
