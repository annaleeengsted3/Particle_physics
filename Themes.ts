import { ColorTheme } from "./ColorTheme";
export class Themes {
  public allThemes: ColorTheme[];

  private _numOfGetThemes: number = -1;

  constructor(themes: ColorTheme[]) {
    this.allThemes = themes;
  }

  public getRandomTheme(): ColorTheme {
    return this.allThemes[Math.floor(Math.random() * this.allThemes.length)];
  }

  public getNextTheme(): ColorTheme {
    this._numOfGetThemes++;
    return this.allThemes[this._numOfGetThemes % this.allThemes.length];
  }

  public add(newTheme: ColorTheme) {
    this.allThemes.push(newTheme);
  }

  public getNumberOfThemes() {
    return this.allThemes.length;
  }

  public static PresetOne(): Themes {
    return new Themes([
      new ColorTheme(["#829FD9", "#D466F2", "#7345FF", "#3E38F2"], "#0b0b0b"), //Purple theme
      new ColorTheme(["#f4f4f4", "#1b32a6", "#1c3acf", "#f4f4f4"], "#272727"), //SetSnailTheme
      new ColorTheme(["#BF0436", "#121022", "#F24C27", "#F22222"], "#06050D"), //Black & Orange
      new ColorTheme(["#D9B23D", "#402A01", "#8C5E08", "#BF8C2C"], "#0a0a0a"), //Gold
      new ColorTheme(["#01402E", "#03A66A", "#02734A", "#025939"], "#012623"), //Green
      new ColorTheme(["#F2BC57", "#F29D52", "#F28B50", "#F2784B"], "#516D73"), //Orange
      new ColorTheme(["#D9D9D9", "#A6A6A6", "#595959", "#262626"], "#0D0D0D"), //Grayscale
      //Water
    ]);
  }
}
