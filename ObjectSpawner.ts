import { Settings } from "./Settings";
import { Speck } from "./Speck";
import { Face, FaceData } from "./Face";
import { ColorTheme } from "./ColorTheme";
import { CanvasPhysicsElement } from "./CanvasPhysicsElement";
import Layers from "./Layers";

export class ObjectSpawner {
  public totalLifeSpan: number;
  public renderItems: CanvasPhysicsElement[];
  public defaultDestX: number;
  public defaultDestY: number;
  public mouseX: number;
  public mouseY: number;
  public isSpawning: boolean = false;
  public colorTheme: ColorTheme;
  public faces: Face[] = [];

  private _spec: Settings;
  private _width: number;
  private _height: number;
  private _currentInterval: NodeJS.Timeout;
  private _spawnNumber: number;
  private _spawnFrequency: number;
  private _numberOfInitialSpawns: number;
  public layers: Layers;

  constructor(
    specs: Settings,
    colors: ColorTheme,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this._spec = specs;
    this._spawnNumber = this._spec.spawnRate.number;
    this._spawnFrequency = this._spec.spawnRate.miliseconds;
    this._numberOfInitialSpawns = this._spec.spawnRate.initialSpawns;
    this.colorTheme = colors;
    this._width = canvasWidth;
    this._height = canvasHeight;
    this.defaultDestX = canvasWidth / 2;
    this.defaultDestY = canvasHeight / 2;
    this.layers = new Layers();
    // this.createInitialSpawnItems();
  }

  public setDimensions(width: number, height: number) {
    this._width = width;
    this._height = height;
    this.defaultDestX = width / 2;
    this.defaultDestY = height / 2;

    this.start();
  }

  public start() {
    this.startSpawnMotor();
  }

  public stop() {
    this.stopSpawnMotor();
  }

  public createLayers(layers: Layers) {
    this.layers = layers;
  }

  private startSpawnMotor() {
    if (this.isSpawning) {
      return;
    }

    this.isSpawning = true;
    this._currentInterval = setInterval(() => {
      for (let i = 0; i < this._spawnNumber; i++) {
        this.spawnNewRandomItem();
      }
    }, this._spawnFrequency);
  }

  private stopSpawnMotor() {
    clearInterval(this._currentInterval);
    this.isSpawning = false;
  }

  private createInitialSpawnItems() {
    this.createEmployeesFromJson("./assets/JSON/faces.json");
  }

  private async createEmployeesFromJson(json: string): Promise<any> {
    const data: FaceData = new FaceData(json);
    await data.load();
    const loadedData = data.getLoadeData();

    const l = loadedData.length;

    for (let i = 0; i < l; i++) {
      let item = new Face(this.totalLifeSpan, loadedData[i].img);
      item.img_src = loadedData[i].img_src;
      item.img_src = loadedData[i].img_src;
      item.alt_src = loadedData[i].alt_src;
      item.alt_src = loadedData[i].alt_src;
      item.mass = loadedData[i].mass;
      item.label = loadedData[i].label;
      item.name = loadedData[i].name;
      this._spec.mouseX = this.mouseX;
      this._spec.mouseY = this.mouseY;
      item.physicsSettings = this._spec;
      item.physicsSettings.spawnPoint.setSettings(
        this._width,
        this._height,
        this.mouseX,
        this.mouseY
      );
      let startPos: { x: number; y: number };
      startPos = item.physicsSettings.spawnPoint.getRandomSpawnPoint();
      item.onKill = this.onSpeckKilled;
      item.x = startPos.x;
      item.y = startPos.y;
      this.layers.addElement(item, "LayerTwo", 1);
    }
  }

  public setGlobalSpecs(spec: Settings) {
    this._spec = spec;
    this._spawnNumber = this._spec.spawnRate.number;
    this._spawnFrequency = this._spec.spawnRate.miliseconds;
    this._numberOfInitialSpawns = this._spec.spawnRate.initialSpawns;
    this.layers.loopThroughAllItems((item: CanvasPhysicsElement) => {
      item.physicsSettings = this._spec;
    });
  }

  public spawnNewRandomItem = (lifespanDelay: number = 0) => {
    let startPos: { x: number; y: number };
    this._spec.mouseX = this.mouseX;
    this._spec.mouseY = this.mouseY;
    this.totalLifeSpan =
      this._spec.minLifeSpan +
      Math.random() * (this._spec.maxLifeSpan - this._spec.minLifeSpan) +
      lifespanDelay;
    let item;
    item = new Speck(this.totalLifeSpan);
    item.physicsSettings = this._spec;
    item.size =
      this._spec.minSize +
      Math.random() * (this._spec.maxSize - this._spec.minSize);
    item.fill = this.colorTheme.getRandomColor();
    item.physicsSettings.spawnPoint.setSettings(
      this._width,
      this._height,
      this.mouseX,
      this.mouseY
    );
    startPos = item.physicsSettings.spawnPoint.getRandomSpawnPoint();
    item.onKill = this.onSpeckKilled;
    item.x = startPos.x;
    item.y = startPos.y;
    this.layers.addElement(item, "LayerOne");
  };

  private onSpeckKilled = (item: CanvasPhysicsElement) => {
    const layer = this.layers.getLayer("LayerOne").getElements();
    const index = layer.indexOf(item);
    if (index !== -1) {
      layer.splice(index, 1);
    }
  };
}
