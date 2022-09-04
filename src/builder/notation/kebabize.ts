export function kebabize(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

// console.log(kebabize('myNameIsStack'));
// console.log(kebabize('MyNameIsStack'));
