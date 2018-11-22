import { Transform } from 'stream'

export default function createPrependStringStream (str) {
  return new Transform({
    transform: function transformer (htmlBuffer, encoding, callback) {
      this.push(Buffer.concat([Buffer.from(str), htmlBuffer]))
      callback()
    }
  })
}
