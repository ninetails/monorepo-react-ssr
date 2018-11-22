export default function promisifyNodeStream (stream) {
  return new Promise(function promisifyNodeStreamPromiseFn (resolve, reject) {
    const buffers = []
    stream.on('error', reject)
    stream.on('data', buffer => buffers.push(buffer))
    stream.on('end', () => resolve(Buffer.concat(buffers)))
  })
}
