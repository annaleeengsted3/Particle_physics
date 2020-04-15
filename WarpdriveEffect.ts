import { ColorTheme } from "./ColorTheme";
// import { MassObject } from './MassObject';
import { Settings } from "./Settings";
import { ObjectSpawner } from "./ObjectSpawner";
import { Face } from "./Face";
import { CanvasPhysicsElement } from "./CanvasPhysicsElement";
//@ts-ignore

export default class WarpdriveEffect {
  public readonly canvas: HTMLCanvasElement;
  public mouseX: number;
  public mouseY: number;
  public isExploding: boolean = false;
  public objectSpawner: ObjectSpawner;

  private _isRendering: boolean = false;
  private _ctx: CanvasRenderingContext2D;
  private _width: number = window.innerWidth;
  private _height: number = window.innerHeight;
  private _colorTheme: ColorTheme;
  private _currentFrame: number;
  private _lastFrame: number;
  //private _massObject: MassObject = new MassObject();
  private _spec: Settings;

  constructor(colors: ColorTheme, specs: Settings = null) {
    this._spec = specs ? specs : new Settings();
    this._colorTheme = colors;
    this.canvas = document.createElement("canvas");
    this._ctx = this.canvas.getContext("2d");
    this._ctx.fillStyle = this._colorTheme.fillColor;
    this.objectSpawner = new ObjectSpawner(
      this._spec,
      colors,
      this._width,
      this._height
    );
  }

  public setGlobalSpecs(spec: Settings) {
    this.objectSpawner.setGlobalSpecs(spec);
  }

  public start() {
    if (this._isRendering) {
      return;
    }
    this.objectSpawner.start();

    this._isRendering = true;
    this.renderObjects();
  }
  public stop() {
    this._isRendering = false;
    this.objectSpawner.stop();
  }

  private calculateFps(performance: number): number {
    this._currentFrame = performance;
    let delta: number = this._currentFrame - this._lastFrame;
    this._lastFrame = this._currentFrame;
    return 1000 / delta;
  }

  private renderObjects = () => {
    if (this._lastFrame == undefined) {
      this._lastFrame = performance.now();
    }

    const fps = this.calculateFps(performance.now());
    //clear canvas before each repaint, could clear transparent with this.ctx.clearRect(0, 0, this._width, this._height):
    this._ctx.fillStyle = this._colorTheme.fillColor;
    this._ctx.fillRect(0, 0, this._width, this._height);

    this.objectSpawner.layers.loopThroughAllItems(
      (item: CanvasPhysicsElement) => {
        item.simulatePhysics(this.mouseX, this.mouseY, fps, this.isExploding);
      }
    );
    this.objectSpawner.layers.loopThroughAllItems(
      (item: CanvasPhysicsElement) => {
        item.render(this._ctx);
      }
    );

    this.detectCollisions();

    //this._massObject.render(this._ctx, this.mouseX, this.mouseY);

    if (this._isRendering) {
      requestAnimationFrame(this.renderObjects);
    }
  };

  public setColorTheme(colorTheme: ColorTheme) {
    this._colorTheme = colorTheme;
    this.objectSpawner.colorTheme = this._colorTheme;
    this._ctx.fillStyle = this._colorTheme.fillColor;
  }
  public setCanvasSize(width: number, height: number) {
    this._width = width;
    this._height = height;
    this.canvas.width = this._width;
    this.canvas.height = this._height;
    this.objectSpawner.setDimensions(width, height);
  }

  public setMousePos(mouseX: number, mouseY: number) {
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.objectSpawner.mouseX = this.mouseX;
    this.objectSpawner.mouseY = this.mouseY;
  }

  private detectCollisions() {
    if (this.objectSpawner.layers.getLayer("LayerTwo") == undefined) {
      return;
    }

    let obj1: Face;
    let obj2: Face;
    const faces: Face[] = this.objectSpawner.layers
      .getLayer("LayerTwo")
      .getElements() as Face[];

    for (let i = 0; i < faces.length; i++) {
      faces[i].isColliding = false;
    }

    for (let i = 0; i < faces.length; i++) {
      obj1 = faces[i];
      for (let j = i + 1; j < faces.length; j++) {
        obj2 = faces[j];

        if (
          this.circleIntersect(
            obj1.x,
            obj1.y,
            obj1.image.width / 2,
            obj2.x,
            obj2.y,
            obj2.image.width / 2
          )
        ) {
          obj1.isColliding = true;
          obj2.isColliding = true;
          this.addCollisionEffects(obj1, obj2);

          const vectorCollision: { x: number; y: number } = {
            x: obj2.x - obj1.x,
            y: obj2.y - obj1.y
          };
          const distance: number = Math.sqrt(
            (obj2.x - obj1.x) * (obj2.x - obj1.x) +
              (obj2.y - obj1.y) * (obj2.y - obj1.y)
          );
          const vectorCollNormalized: { x: number; y: number } = {
            x: vectorCollision.x / distance,
            y: vectorCollision.y / distance
          };
          const vRelativeVelocity: { x: number; y: number } = {
            x: obj1._vectorX - obj2._vectorX,
            y: obj1._vectorY - obj2._vectorY
          };
          const speed: number =
            vRelativeVelocity.x * vectorCollNormalized.x +
            vRelativeVelocity.y * vectorCollNormalized.y;
          if (speed < 0) {
            break;
          }
          const impulse: number = (2 * speed) / (obj1.mass + obj2.mass);
          obj1._vectorX -= impulse * obj2.mass * vectorCollNormalized.x;
          obj1._vectorY -= impulse * obj2.mass * vectorCollNormalized.y;
          obj2._vectorX += impulse * obj1.mass * vectorCollNormalized.x;
          obj2._vectorY += impulse * obj1.mass * vectorCollNormalized.y;
        }
      }
    }
  }

  private addCollisionEffects(obj1: Face, obj2: Face) {
    // obj1.image.src = './assets/img/harold.png';
    obj1.image.src = obj1.alt_src;
    obj1.employeeText = "noice";
    obj2.image.src = obj2.alt_src;
    obj2.employeeText = "noice";
    setTimeout(() => {
      obj1.image.src = obj1.img_src;
      obj1.employeeText = " ";
      obj2.image.src = obj2.img_src;
      obj2.employeeText = " ";
    }, 500);
  }

  private circleIntersect(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number
  ) {
    const squareDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    //returns true if squaredistance is equal to or less than sum of squared radiuses
    return squareDistance <= (r1 + r2) * (r1 + r2);
  }
}
