export const range = (n: number) => [...Array(n).keys()]

export const objectFromValues = (...kvs: any[]) => kvs.reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
