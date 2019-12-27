
export function device(val) {
    const data = { 1: '水位高度', 2: '流量' }
    return data[val]
}