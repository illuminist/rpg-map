export const makeUrl = (url: string) => {
  if (url) {
    if (url.startsWith('/')) {
      return process.env.PUBLIC_URL + url
    }
  }

  return url
}

export default makeUrl
