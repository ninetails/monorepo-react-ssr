import getRoot from './getRoot'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('helpers/getRoot', () => {
  describe('existing root', () => {
    it('should get element by passed id', () => {
      const mockText = 'mocked content'
      const mockId = 'mock-root'
      document.body.innerHTML = `<div id="${mockId}">${mockText}</div>`

      const root = getRoot(mockId)
      expect(root.innerHTML).toBe(mockText)
    })

    it('should get "root" as default id', () => {
      const mockText = 'mocked content'
      document.body.innerHTML = `<div id="root">${mockText}</div>`

      const root = getRoot()
      expect(root.innerHTML).toBe(mockText)
    })
  })

  describe('not existing root', () => {
    it('should create and append an element to body', () => {
      const mockText = 'mocked content'
      const mockId = 'mock-root'

      expect(document.body.firstChild).toBeFalsy()

      const root = getRoot(mockId)
      root.innerHTML = mockText

      const snapshot = `
<div
  id="mock-root"
>
  mocked content
</div>
`
      expect(document.body.firstChild).toMatchInlineSnapshot(snapshot)
      expect(root.id).toBe(mockId)
    })
  })
})
