import getRoot from './getRoot'

let mockRootElement, spyGetElement, spyCreateElement, spyAppendChild

beforeAll(() => {
  mockRootElement = {}
  spyGetElement = jest.spyOn(document, 'getElementById')
  spyCreateElement = jest.spyOn(document, 'createElement')
  spyAppendChild = jest.spyOn(document.body, 'appendChild')
})

beforeEach(() => {
  spyAppendChild.mockImplementation(jest.fn)
})

afterEach(jest.clearAllMocks)
afterAll(jest.restoreAllMocks)

describe('getRoot', () => {
  describe('with id="root" by default', () => {
    it('should call document.getElementById passing id', () => {
      spyGetElement.mockImplementation(() => mockRootElement)
      expect(getRoot()).toBe(mockRootElement)
      expect(spyGetElement).toHaveBeenCalledWith('root')
      expect(mockRootElement.id).not.toBe('root')
    })

    describe('without finding element', () => {
      beforeEach(() => {
        spyGetElement.mockImplementation(() => null)
        spyCreateElement.mockImplementation(() => mockRootElement)
      })

      it('should call document.createElement receiving div by default', () => {
        getRoot()
        expect(spyCreateElement).toHaveBeenCalledWith('div')
      })

      it('should call document.body.appendChild with created div and given id', () => {
        getRoot()
        expect(spyAppendChild).toHaveBeenCalledWith(mockRootElement)
        expect(mockRootElement.id).toBe('root')
      })

      it('should return created element', () => {
        expect(getRoot()).toBe(mockRootElement)
        expect(mockRootElement.id).toBe('root')
      })
    })
  })

  describe('with a custom id', () => {
    const mockCustomId = 'foo'

    it('should call document.getElementById passing a custom id', () => {
      spyGetElement.mockImplementation(() => mockRootElement)
      expect(getRoot(mockCustomId)).toBe(mockRootElement)
      expect(spyGetElement).toHaveBeenCalledWith(mockCustomId)
    })

    describe('without finding element', () => {
      beforeEach(() => {
        spyGetElement.mockImplementation(() => null)
        spyCreateElement.mockImplementation(() => mockRootElement)
      })

      it('should assign custom id to new element', () => {
        expect(getRoot(mockCustomId)).toBe(mockRootElement)
        expect(mockRootElement.id).toBe(mockCustomId)
      })
    })
  })

  describe('passing custom', () => {
    describe('tag', function () {
      const mockTag = 'span'

      beforeEach(() => {
        spyGetElement.mockImplementation(() => null)
        spyCreateElement.mockImplementation(() => mockRootElement)
      })

      it('should create a custom element', () => {
        getRoot(undefined, { tag: mockTag })
        expect(spyCreateElement).toHaveBeenCalledWith(mockTag)
      })
    })
  })
})
