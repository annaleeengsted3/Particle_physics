import { CanvasPhysicsElement } from "./CanvasPhysicsElement";
import MultipleImageLoader from "./MultipleImageLoader";

export class Face extends CanvasPhysicsElement {
  public isColliding: boolean = false;
  public image: HTMLImageElement;
  public label: string;
  public mass: number;
  public name: string;
  public employeeText: string;
  public img_src: string;
  public alt_src: string;

  constructor(lifespan: number, image: HTMLImageElement, text: string = " ") {
    super(lifespan);
    this.image = image;
    this.employeeText = text;
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.image.width * 1.5,
      this.image.width * 1.5
    );

    this.renderUI(ctx);
  }

  public renderUI(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(this.employeeText, this.x, this.y);
  }

  protected checkAndSetLife(): void {}
}

export class FaceData {
  private _faceData: {
    label: "string";
    name: "string";
    mass: number;
    img_src: string;
    alt_src: string;
    img: HTMLImageElement;
  }[];
  private _json: string;
  constructor(json: string) {
    this._json = json;
  }

  public async load() {
    let jsonData = await fetch(this._json);

    this._faceData = await jsonData.json();

    await this.setFaceSpecs();
  }

  public getLoadeData() {
    return this._faceData;
  }

  private async setFaceSpecs() {
    const imageLoader: MultipleImageLoader = new MultipleImageLoader();

    //this is executed automatically when the promise is constructed:
    this._faceData.forEach(faceData => {
      imageLoader.addSrcs(faceData.img_src);
    });

    await imageLoader.load();

    let images = imageLoader.getAllLoadedImages;
    for (let i = 0; i < this._faceData.length; i++) {
      this._faceData[i].img = images[i];
    }
  }
}
