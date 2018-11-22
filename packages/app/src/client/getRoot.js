export default function getRoot (
  id = 'root',
  { tag = 'div', document = window.document } = {}
) {
  let root = document.getElementById(id)

  if (!root) {
    root = document.createElement(tag)
    root.id = id
    document.body.appendChild(root)
  }

  return root
}
