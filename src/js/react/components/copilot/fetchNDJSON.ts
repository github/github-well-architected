// Heavily inspired by https://www.npmjs.com/package/fetch-ndjson
// Under MIT license
export default async function* gen<T = unknown>(
  reader: ReadableStreamDefaultReader,
): AsyncGenerator<T | unknown, undefined, void> {
  const matcher = /\r?\n/
  const decoder = new TextDecoder()
  let buffer = ''

  let next = reader.read()
  while (true) {
    const {done, value} = await next

    if (done) {
      if (buffer.length > 0) {
        yield JSON.parse(buffer)
      }
      return
    }

    const chunk = decoder.decode(value, {stream: true})
    buffer += chunk

    const parts = buffer.split(matcher)
    buffer = parts.pop() || ''
    for (const i of parts) {
      yield JSON.parse(i)
    }

    next = reader.read()
  }
}