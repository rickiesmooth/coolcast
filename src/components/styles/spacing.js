const spacingFactor = 5
export const spacing = {
  space0: computeGoldenRatio(spacingFactor, 0), // 5
  space1: computeGoldenRatio(spacingFactor, 1), // 8
  space2: computeGoldenRatio(spacingFactor, 2), // 13
  space3: computeGoldenRatio(spacingFactor, 3), // 21
  space4: computeGoldenRatio(spacingFactor, 4), // 34
  space5: computeGoldenRatio(spacingFactor, 5) // 55
}

function computeGoldenRatio(spacingFactor, exp) {
  return Math.round(spacingFactor * Math.pow(1.618, exp))
}
