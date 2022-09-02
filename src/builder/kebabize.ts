export function kebabize(str: string) {
  return str
    .split('')
    .map((letter, idx) => {
      return letter.toUpperCase() === letter ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}` : letter
    })
    .join('')
}

// console.log(kebabize('myNameIsStack'));
// console.log(kebabize('MyNameIsStack'));
