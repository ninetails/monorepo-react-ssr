import { renderToString } from 'react-dom/server'
import renderContent from './renderContent'

jest.mock('react-dom/server', () => ({ renderToString: jest.fn() }))

afterEach(jest.resetAllMocks)
afterAll(jest.restoreAllMocks)

describe('helpers/renderContent', () => {
  it('should call renderToString passing first argument', async () => {
    const mockContent = 'mocked content'
    const mockReturn = 'foo'

    renderToString.mockReturnValueOnce(mockReturn)

    const expected = await renderContent(mockContent)
    expect(expected).toBe(mockReturn)
    expect(renderToString).toHaveBeenNthCalledWith(1, mockContent)
  })

  it('should call again if renderToString throws a resolving Promise', async () => {
    const mockContent = 'mocked content'
    const mockReturn = 'foo'

    renderToString
      .mockImplementationOnce(() => throw new Promise(resolve => resolve()))
      .mockImplementationOnce(() => mockReturn)

    const expected = await renderContent(mockContent)
    expect(expected).toBe(mockReturn)
    expect(renderToString).toHaveBeenCalledTimes(2)
  })

  it('should not call again if renderToString throws a rejecting Promise', () => {
    const mockContent = 'mocked content'
    const mockReturn = 'foo'
    const mockError = new Error('mocked error')

    renderToString
      .mockImplementationOnce(() => throw new Promise((resolve, reject) => reject(mockError)))
      .mockImplementationOnce(() => mockReturn)

    expect(renderContent(mockContent)).rejects.toThrow(mockError)
    expect(renderToString).toHaveBeenCalledTimes(1)
  })

  it('should not call again if renderToString throws an error', () => {
    const mockContent = 'mocked content'
    const mockReturn = 'foo'
    const mockError = new Error('mocked error')

    renderToString
      .mockImplementationOnce(() => throw mockError)
      .mockImplementationOnce(() => mockReturn)

    expect(renderContent(mockContent)).rejects.toThrow(mockError)
    expect(renderToString).toHaveBeenCalledTimes(1)
  })
})
