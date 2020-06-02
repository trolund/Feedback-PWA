export const chartColors = {
  start: 'rgba(5, 148, 166, 1)',
  end: 'rgba(5, 148, 166, 0.2)',
  border: '#0594a6',
  hightlight: '#ff6c23'
}

export const genColor = (): string => {
  const c1 = Math.floor(Math.random() * 10)
  const c2 = Math.floor(Math.random() * 10 + 148)
  const c3 = Math.floor(Math.random() * 10 + 166)

  return `rgba(${c1}, ${c2}, ${c3}, ${Math.random()})`
}
