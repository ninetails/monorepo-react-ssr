import createRenderChunk from './createRenderChunk'

afterEach(jest.resetAllMocks)

describe('helpers/createRenderChunk', () => {
  it('should return a function', () => {
    const mockStats = {}

    expect(typeof createRenderChunk(mockStats)).toBe('function')
  })

  describe('calling render function', () => {
    it('should return null without passing chunk', () => {
      const mockFn = () => 'foo'

      const renderChunk = createRenderChunk()
      expect(renderChunk(mockFn)).toBeNull()
    })

    it('should call function once passing one string chunk', () => {
      const mockChunk = 'mock chunk'
      const mockStats = {
        assetsByChunkName: mockChunk
      }
      const mockReturn = 'foo'
      const mockFn = jest.fn(() => mockReturn)

      const renderChunk = createRenderChunk(mockStats)
      expect(renderChunk(mockFn)).toBe(mockReturn)
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenNthCalledWith(1, mockChunk, '')
    })

    it('should be called with two string chunks on array', () => {
      const mockChunkOne = 'mock chunk 1'
      const mockChunkTwo = 'mock chunk 2'
      const mockStats = {
        assetsByChunkName: [
          mockChunkOne,
          mockChunkTwo
        ]
      }
      const mockReturnOne = 'foo1'
      const mockReturnTwo = 'foo2'
      const mockFn = jest.fn(arg => arg === mockChunkOne ? mockReturnOne : mockReturnTwo)

      const renderChunk = createRenderChunk(mockStats)
      expect(renderChunk(mockFn)).toEqual([mockReturnOne, mockReturnTwo])
      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenNthCalledWith(1, mockChunkOne, 0)
      expect(mockFn).toHaveBeenNthCalledWith(2, mockChunkTwo, 1)
    })

    it('should ignore .map files when provided with two string chunks on array', () => {
      const mockChunkFile = 'mock chunk 1'
      const mockChunkMap = 'mockchunk.map'
      const mockStats = {
        assetsByChunkName: [
          mockChunkFile,
          mockChunkMap
        ]
      }
      const mockReturnOne = 'foo1'
      const mockReturnTwo = 'foo2'
      const mockFn = jest.fn(arg => arg === mockChunkFile ? mockReturnOne : mockReturnTwo)

      const renderChunk = createRenderChunk(mockStats)
      expect(renderChunk(mockFn)).toEqual([mockReturnOne])
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenNthCalledWith(1, mockChunkFile, 0)
    })

    it('should be called with a simple object', () => {
      const mockChunk = 'mock chunk'
      const mockChunkName = 'mockmain'
      const mockStats = {
        assetsByChunkName: {
          [mockChunkName]: mockChunk
        }
      }
      const mockFn = jest.fn((chunk, key) => `${key}: ${chunk}`)

      const renderChunk = createRenderChunk(mockStats)
      expect(renderChunk(mockFn)).toBe(`${mockChunkName}: ${mockChunk}`)
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenNthCalledWith(1, mockChunk, mockChunkName)
    })

    it('should be called with a object with one array and one string', () => {
      const mockChunkOne = 'mock chunk 1'
      const mockChunkTwoOne = 'mock chunk 2-1'
      const mockChunkTwoTwo = 'mock chunk 2-1'
      const mockChunkNameOne = 'mockmainone'
      const mockChunkNameTwo = 'mockmaintwo'
      const mockStats = {
        assetsByChunkName: {
          [mockChunkNameOne]: mockChunkOne,
          [mockChunkNameTwo]: [
            mockChunkTwoOne,
            mockChunkTwoTwo
          ]
        }
      }
      const mockFn = jest.fn((chunk, key) => `${key}: ${chunk}`)
      const expected = [
        `${mockChunkNameOne}: ${mockChunkOne}`,
        `${mockChunkNameTwo}-0: ${mockChunkTwoOne}`,
        `${mockChunkNameTwo}-1: ${mockChunkTwoTwo}`
      ]

      const renderChunk = createRenderChunk(mockStats)
      expect(renderChunk(mockFn)).toEqual(expected)
      expect(mockFn).toHaveBeenCalledTimes(3)
      expect(mockFn).toHaveBeenNthCalledWith(1, mockChunkOne, mockChunkNameOne)
      expect(mockFn).toHaveBeenNthCalledWith(2, mockChunkTwoOne, `${mockChunkNameTwo}-0`)
      expect(mockFn).toHaveBeenNthCalledWith(3, mockChunkTwoTwo, `${mockChunkNameTwo}-1`)
    })
  })
})
