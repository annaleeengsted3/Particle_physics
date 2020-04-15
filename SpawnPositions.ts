import MathUtils from "./MathUtils";

export default class SpawnPositions {
  private _spawnPositions: SpawnPosition[] = [];
  private defaultSpawnPosition: SpawnPosition;

  public setSettings(
    width: number,
    height: number,
    mouseX: number,
    mouseY: number
  ) {
    this._spawnPositions.forEach(item => {
      item.width = width;
      item.height = height;
      item.mouseX = mouseX;
      item.mouseY = mouseY;

      // 	item.setFrameFPS(fps);
    });
    this.defaultSpawnPosition = new SpawnPositionCirc(
      width / 2,
      width / 2,
      height / 2
    );
  }

  public addSpawnPoint(point: SpawnPosition) {
    this._spawnPositions.push(point);
  }

  public getRandomSpawnPoint(): { x: number; y: number } {
    if (this._spawnPositions.length === 0) {
      return this.defaultSpawnPosition.getSpawnPosition();
    }

    const randomSpawnPoint = this._spawnPositions[
      Math.floor(this._spawnPositions.length * Math.random())
    ];

    return randomSpawnPoint.getSpawnPosition();
  }
}

export abstract class SpawnPosition {
  public width: number;
  public height: number;

  public mouseX: number = this.width / 2;
  public mouseY: number = this.height / 2;

  public abstract getSpawnPosition(): { x: number; y: number };
}

export class SpawnPositionRect extends SpawnPosition {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;

  constructor(x: number, y: number, width: number, height: number) {
    super();
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  public getSpawnPosition(): { x: number; y: number } {
    return MathUtils.getRandomPositionInRectangle(
      this._width,
      this._height,
      this._x,
      this._y
    );
  }
}

export class SpawnPositionCirc extends SpawnPosition {
  private readonly _offsetX: number;
  private readonly _offsetY: number;
  private _radius: number;
  private isMouseSpawnPos: boolean = false;

  constructor(
    radius: number,
    xOffset: number,
    yOffset: number,
    isMouseSpawnPos: boolean = false
  ) {
    super();

    this.isMouseSpawnPos = isMouseSpawnPos;
    this._offsetX = xOffset;
    this._offsetY = yOffset;
    this._radius = radius;
  }

  public getSpawnPosition(): { x: number; y: number } {
    let x: number = this._offsetX;
    let y: number = this._offsetY;

    if (this.isMouseSpawnPos) {
      if (this.mouseX === undefined || this.mouseY === undefined) {
        x = this.width / 2;
        y = this.height / 2;
      } else {
        x += this.mouseX;
        y += this.mouseY;
      }
    }
    return MathUtils.getRandomPositionInCircle(this._radius, x, y);
  }
}

export class SpawnPositionLine extends SpawnPosition {
  private _fromX: number;
  private _fromY: number;
  private _toX: number;
  private _toY: number;

  constructor(x: number, y: number, toX: number, toY: number) {
    super();
    this._fromX = x;
    this._fromY = y;
    this._toX = toX;
    this._toY = toY;
  }

  public getSpawnPosition(): { x: number; y: number } {
    return MathUtils.getRandomPositionInLine(
      this._fromX,
      this._fromY,
      this._toX,
      this._toY
    );
  }
}

export class SpawnPositionTriangle extends SpawnPosition {
  private _x1: number;
  private _y1: number;
  private _x2: number;
  private _y2: number;
  private _x3: number;
  private _y3: number;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) {
    super();
    this._x3 = x3;
    this._x2 = x2;
    this._x1 = x1;
    this._y3 = y3;
    this._y2 = y2;
    this._y1 = y1;
  }

  public getSpawnPosition(): { x: number; y: number } {
    const line1 = MathUtils.getRandomPositionInLine(
      this._x1,
      this._y1,
      this._x2,
      this._y2
    );
    const line2 = MathUtils.getRandomPositionInLine(
      this._x2,
      this._y2,
      this._x3,
      this._y3
    );
    const line3 = MathUtils.getRandomPositionInLine(
      this._x3,
      this._y3,
      this._x1,
      this._y1
    );
    const lines: [
      { x: number; y: number },
      { x: number; y: number },
      { x: number; y: number }
    ] = [line1, line2, line3];
    return lines[Math.floor(lines.length * Math.random())];
  }
}

export class SpawnPositionExponential extends SpawnPosition {
  private _growthRate: number;
  private _startingValue: number;

  constructor(a: number, b: number) {
    super();
    this._growthRate = a;
    this._startingValue = b;
  }

  public getSpawnPosition(): { x: number; y: number } {
    return MathUtils.getRandomPositionInExponentialLine(
      this._growthRate,
      this._startingValue
    );
  }
}

export class SpawnPositionSineCurve extends SpawnPosition {
  private _amplitude: number;
  private _waveFrequemcy: number;

  constructor(a: number, b: number) {
    super();
    this._amplitude = a;
    this._waveFrequemcy = b;
  }

  public getSpawnPosition(): { x: number; y: number } {
    return MathUtils.getRandomPositionInSineCurve(
      this._amplitude,
      this._waveFrequemcy
    );
  }
}

export class SpawnPositionAnimated extends SpawnPosition {
  private _x: number;
  private _y: number;
  private _radius: number;
  private _velocityX: number = 2;
  private _velocityY: number = 0;

  constructor(radius: number, startX: number, startY: number) {
    super();
    this._radius = radius;
    this._x = startX;
    this._y = startY;
  }

  private getNextPosition(): { x: number; y: number } {
    // this._x = this._x + this._velocityX;
    // this._y = this._y + this._velocityY;

    this._x = this._x + this._velocityX;
    this._y = 200 * Math.sin(((2 * Math.PI) / 250) * (this._x - 300)) + 400;

    if (this._x >= window.innerWidth || this._x <= 0) {
      this._velocityX = this._velocityX * -1;
    }
    if (this._y >= window.innerHeight || this._y <= 0) {
      this._velocityY = this._velocityY * -1;
    }
    return { x: this._x, y: this._y };
  }

  public getSpawnPosition(): { x: number; y: number } {
    let nextPosition = this.getNextPosition();
    this._x = nextPosition.x;
    this._y = nextPosition.y;

    //return MathUtils.getRandomPositionInCircle(this._radius, this._x, this._y);
    return { x: this._x, y: this._y };
  }
}
