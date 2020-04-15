export default class ColorUtils {
  public static getRandomHex(addHex: boolean = true): string {
    let preFix = addHex ? "#" : "";
    return preFix + Math.floor(Math.random() * 16777215).toString(16);
  }

  public static hexToRGB(hex: string, alpha: number) {
    let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  public static rgbToHex(r: number, g: number, b: number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}
