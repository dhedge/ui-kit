export const sliceByIndex = <T>(data: T[], index: number) => {
  const firstPart = data.slice(0, index)
  const secondPart = data.slice(index)

  return { firstPart, secondPart }
}
