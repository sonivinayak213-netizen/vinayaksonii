// Fundamental & SIP formulas helpers
export function intrinsicValueGraham(eps, growthRate, bondYield=4.4){
  // Graham formula approximation
  return eps * (8.5 + 2 * growthRate) * (4.4 / bondYield)
}
export function sipFutureValue(monthly, annualRate, years){
  const r = annualRate/100; const n = 12; const t = years;
  return monthly * ((Math.pow(1 + r/n, n*t) - 1) / (r/n));
}
export function rollingAverage(arr, window){
  if(!arr.length) return []
  const res = []
  for(let i=0;i<arr.length;i++){
    const start = Math.max(0,i-window+1)
    const slice = arr.slice(start,i+1)
    res.push(slice.reduce((a,b)=>a+b,0)/slice.length)
  }
  return res
}
