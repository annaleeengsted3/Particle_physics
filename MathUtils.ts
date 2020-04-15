export default class MathUtils {
  public static roundToDecimal(value: number, numOfLeading: number) {
    let dec = Math.pow(10, numOfLeading);
    return Math.round(value * dec) / dec;
  }

  public static ceilToDecimal(value: number, numOfLeading: number) {
    let dec = Math.pow(10, numOfLeading);
    return Math.ceil(value * dec) / dec;
  }

  public static floorToDecimal(value: number, numOfLeading: number) {
    let dec = Math.pow(10, numOfLeading);
    return Math.floor(value * dec) / dec;
  }

  public static clamp(val: number, min: number = 0, max: number = 1) {
    return val > max ? max : val < min ? min : val;
  }

  public static ratioFromRatio(
    start: number,
    end: number,
    ratio: number,
    ignoreOverflow: boolean = false
  ) {
    const diff = 1 / (end - start);
    let newRatio = diff * ratio - start * diff;
    return ignoreOverflow ? MathUtils.clamp(newRatio) : newRatio;
  }

  public static getRandomPositionInCircle(
    radius: number,
    offsetX: number = 0,
    offsetY: number = 0
  ): { x: number; y: number } {
    var pt_angle = Math.random() * 2 * Math.PI;
    var pt_radius_sq = Math.random() * radius * radius;
    var pt_x = Math.sqrt(pt_radius_sq) * Math.cos(pt_angle);
    var pt_y = Math.sqrt(pt_radius_sq) * Math.sin(pt_angle);
    return { x: pt_x + offsetX, y: pt_y + offsetY };
  }

  // public getOuterPositionInCircle(radius: number, offsetX: number = 0, offsetY: number = 0) {
  // 	const rad = Math.random() * Math.PI * 2;
  // 	const dist = Math.random() * (radius - radius * 0.6) + radius;
  // 	return { x: Math.cos(rad) * dist + offsetX, y: Math.sin(rad) * dist + offsetY };
  // }

  public static getRandomPositionInRectangle(
    width: number,
    height: number,
    offsetX: number = 0,
    offsetY: number = 0
  ): { x: number; y: number } {
    let x = Math.random() * width;
    let y = Math.random() * height;
    return { x: x + offsetX, y: y + offsetY };
  }

  public static getRandomPositionInLine(
    fromX: number = 0,
    fromY: number = 0,
    toX: number,
    toY: number
  ): { x: number; y: number } {
    let a: number;
    let b: number;
    let x: number;
    if (fromY - toY === 0 || fromX - toX === 0) {
      a = 0;
    }
    a = (toY - fromY) / (toX - fromX);
    b = fromY - a * fromX;
    x = Math.random() * (toX - fromX) + fromX;
    let y = a * x + b;

    return { x: x, y: y };
  }

  public static getRandomPositionInExponentialLine(
    growthRate: number = 0,
    startingValue: number = 0
  ): { x: number; y: number } {
    let a: number = growthRate;
    let b: number = startingValue;
    let x: number = Math.random() * window.innerWidth;
    let y = b * a ** x;

    return { x: x, y: y };
  }

  public static getRandomPositionInSineCurve(
    amplitude: number = 0,
    waveFrequemcy: number = 0
  ): { x: number; y: number } {
    let a: number = amplitude;
    let f: number = (2 * Math.PI) / waveFrequemcy;
    let x: number = Math.random() * window.innerWidth;
    let yStartingPos: number = 800;
    let y = a * Math.sin(f * (x - 1)) + yStartingPos;
    return { x: x, y: y };
  }
}
