import { Settings } from "./Settings";
import MathUtils from "./MathUtils";
export abstract class CanvasPhysicsElement {
  public onKill: Function; //callback
  public x: number = 0;
  public y: number = 0;
  public explosion: boolean = false;
  public physicsSettings: Settings;
  public lastX: number = null;
  public lastY: number = null;
  public currentLifeSpan: number = 0;
  public totalLifeSpan: number = 0;
  public deltaTime: number;
  public isDead: boolean = false;
  public isFace: boolean = false;
  public _vectorX: number = 0;
  public _vectorY: number = 0;

  private _trajectoryAngle: number;
  constructor(lifespan: number) {
    this.totalLifeSpan = lifespan;
  }

  public abstract render(ctx: CanvasRenderingContext2D): void;

  public simulatePhysics(
    destX: number,
    destY: number,
    fps: number,
    explosion: boolean
  ) {
    if (this.lastX == null) {
      this.lastX = this.x;
    }
    if (this.lastY == null) {
      this.lastY = this.y;
    }
    this.deltaTime = 60 / fps;

    this.calculatePhysics(destX, destY, fps, explosion);

    this.lastX = this.x;
    this.lastY = this.y;
    this.applyVectorOffset();
  }

  protected calculatePhysics(
    destX: number,
    destY: number,
    fps: number,
    explosion: boolean
  ) {
    this.applyForceTowardsPoint(destX, destY);
    this.applyForceTowardsPoint(
      destX,
      destY,
      this.physicsSettings.vortexAngle * Math.PI,
      this.physicsSettings.vortexForce
    );

    if (explosion) {
      const distMultiplier: number = MathUtils.clamp(
        1 / this.getDistanceToPoint(destX, destY),
        0,
        1
      );
      this.applyForceTowardsPoint(
        destX,
        destY,
        0,
        this.physicsSettings.explosionForce * distMultiplier
      );
    }

    this.applyFriction();
    this.checkAndSetLife();
  }

  protected applyVectorOffset() {
    this.x += this._vectorX * this.deltaTime; //the higher framerate, the shorter they should move per frame
    this.y += this._vectorY * this.deltaTime;
  }

  private applyForceTowardsPoint(
    destX: number,
    destY: number,
    offsetAngle: number = 0,
    offsetVector: number = 1
  ) {
    this._trajectoryAngle =
      this.getThisAngleToPoint(destX, destY) + offsetAngle; //offset the origin angle to achieve vortex.
    //calculate the size of the normalized vector/distance added per frame
    this._vectorX -=
      Math.cos(this._trajectoryAngle) *
      this.physicsSettings.speedCoefficient *
      offsetVector *
      this.physicsSettings.vortexDistortX;
    this._vectorY -=
      Math.sin(this._trajectoryAngle) *
      this.physicsSettings.speedCoefficient *
      offsetVector *
      this.physicsSettings.vortexDistortY;
  }
  private getDistanceToPoint(pointX: number, pointY: number): number {
    return Math.hypot(this.x - pointX, this.y - pointY);
  }

  public getThisAngleToPoint(pointX: number, pointY: number): number {
    const deltaX: number = this.x - pointX;
    const deltaY: number = this.y - pointY;
    return Math.atan2(deltaY, deltaX);
  }

  private applyFriction() {
    this._vectorX = this._vectorX * this.physicsSettings.friction;
    this._vectorY = this._vectorY * this.physicsSettings.friction;
  }

  protected checkAndSetLife() {
    this.currentLifeSpan++;
    if (this.currentLifeSpan >= this.totalLifeSpan) {
      this.isDead == true;
      if (this.onKill !== undefined) {
        this.onKill(this);
      }
    }
  }
}
