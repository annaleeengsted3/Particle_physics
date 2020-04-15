import ColorUtils from "./ColorUtils";
import MathUtils from "./MathUtils";
import { Settings } from "./Settings";
import { CanvasPhysicsElement } from "./CanvasPhysicsElement";

export class Speck extends CanvasPhysicsElement {
  public fill: string = "pink";
  public size: number = 1;
  private _ellipseTrajectoryAngle: number;
  private _sizeRatioX: number;
  private _sizeRatioY: number;
  private _moveSpeed: number;

  // constructor(lifespan: number) {
  // 	//super();
  // 	//this._totalLifeSpan = lifespan;
  // }

  render(ctx: CanvasRenderingContext2D) {
    //super.render(ctx);
    const width = this._sizeRatioX * this.size;
    const height = this._sizeRatioY * this.size;

    if (width <= 0 || height <= 0) {
      return;
    }
    if (this.isDead) {
      return;
    }
    const killRatio: number = this.currentLifeSpan / this.totalLifeSpan;
    const inAlpha: number = MathUtils.ratioFromRatio(
      0,
      this.physicsSettings.alphaInRatio,
      killRatio,
      true
    );
    const outAlpha: number =
      1 -
      MathUtils.ratioFromRatio(
        this.physicsSettings.alphaOutRatio,
        1,
        killRatio,
        true
      );

    let hexColor: string;
    hexColor = ColorUtils.hexToRGB(this.fill, 1);
    if (killRatio <= this.physicsSettings.alphaInRatio) {
      hexColor = ColorUtils.hexToRGB(this.fill, inAlpha);
    }
    if (killRatio >= this.physicsSettings.alphaOutRatio) {
      hexColor = ColorUtils.hexToRGB(this.fill, outAlpha);
    }

    // this.ctx.beginPath();
    // this.ctx.ellipse(this.x, this.y, width, height, this._ellipseTrajectoryAngle, 0, Math.PI * 2);
    // this.ctx.fillStyle = hexColor;
    // this.ctx.fill();
    ctx.beginPath();
    ctx.ellipse(
      this.x,
      this.y,
      width,
      height,
      this._ellipseTrajectoryAngle,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = hexColor;
    ctx.fill();
  }

  protected calculatePhysics(
    destX: number,
    destY: number,
    fps: number,
    explosion: boolean
  ) {
    super.calculatePhysics(destX, destY, fps, explosion);

    this.calculateEllipseTrajectory();
    this.calculateSize();
  }

  private calculateEllipseTrajectory() {
    this._ellipseTrajectoryAngle =
      Math.PI * 0.5 + this.getThisAngleToPoint(this.lastX, this.lastY);
  }

  private calculateSize() {
    let calculatedSpeedX: number = this.lastX - this.x;
    let calculatedSpeedY: number = this.lastY - this.y;
    this._moveSpeed =
      Math.hypot(calculatedSpeedX, calculatedSpeedY) / this.deltaTime;
    this._sizeRatioX = MathUtils.clamp(this._moveSpeed, 0, 1);
    this._sizeRatioY =
      this._sizeRatioX *
      this._moveSpeed *
      this.physicsSettings.degreeOfEllipseStretch; //the degree of stretch on one param should always be greater than the other.
  }
}
