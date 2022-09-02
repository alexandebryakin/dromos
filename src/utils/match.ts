export function match(pattern: string, url: string = window.location.pathname) {
  const unwrapSlashes = (pathname: string) => {
    return pathname
      .split('/')
      .filter((p) => !!p)
      .join('/')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pathname, _query] = url.split('?')

  const patternParts = unwrapSlashes(pattern).split('/')
  const urlParts = unwrapSlashes(pathname).split('/')

  const variables: { [variableName: string]: string } = {}
  patternParts.forEach((part, index) => {
    const urlPart = urlParts[index]
    if (part.startsWith(':')) {
      const [, variableName] = part.split(':')
      variables[variableName] = urlPart
    }
  })
  return {
    variables,
  }
}
