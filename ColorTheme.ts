export class ColorTheme {
  public readonly colors: string[];
  public readonly fillColor: string;

  constructor(colors: string[], fill: string) {
    this.colors = colors;
    this.fillColor = fill;
  }

  public getRandomColor(): string {
    return this.colors[Math.floor(this.colors.length * Math.random())];
  }
}
