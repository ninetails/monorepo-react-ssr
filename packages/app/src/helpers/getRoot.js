export default function getRoot (id = 'root', { defaultTag = 'div', document = window.document } = {}) {
  let root = document.getElementById(id)

  if (!root) {
    root = document.createElement(defaultTag)
    root.id = id
    document.body.appendChild(root)
  }

  return root
}
