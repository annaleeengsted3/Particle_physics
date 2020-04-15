import { CanvasPhysicsElement } from "./CanvasPhysicsElement";

export default class Layers {
  private _layeredRenderItems: { [layer: string]: LayerElement } = {};

  public addElement(
    item: CanvasPhysicsElement,
    layerName: string,
    zIndex: number = 0
  ) {
    if (!this._layeredRenderItems[layerName]) {
      this._layeredRenderItems[layerName] = new LayerElement(layerName, zIndex);
    }

    this._layeredRenderItems[layerName].add(item);
  }

  public loopThroughAllItems(callback: Function) {
    const keys = Object.keys(this._layeredRenderItems);
    let sortedKeys = this.sortLayersByZIndex(keys);
    const l = sortedKeys.length;
    for (let i = 0; i < l; i++) {
      this.getLayer(sortedKeys[i].layer)
        .getElements()
        .forEach((item: CanvasPhysicsElement) => {
          callback(item);
        });
    }
  }

  public getLayer(label: string) {
    return this._layeredRenderItems[label];
  }

  private sortLayersByZIndex(keys: string[]) {
    let sortedKeys = [];
    for (let i = 0; i < keys.length; i++) {
      let layerName = this.getLayer(keys[i]).label;
      let layerZIndex = this.getLayer(keys[i]).zIndex;
      let layer = { layer: layerName, zIndex: layerZIndex };
      sortedKeys.push(layer);
    }
    sortedKeys.sort(function(a, b) {
      return a.zIndex - b.zIndex;
    });
    return sortedKeys;
  }
}

export class LayerElement {
  public zIndex: number = 0;
  public label: string = "default";

  private _elements: CanvasPhysicsElement[] = [];

  constructor(label: string, index: number) {
    this.label = label;
    this.zIndex = index;
  }

  public getElements() {
    return this._elements;
  }

  public add(item: CanvasPhysicsElement) {
    this._elements.push(item);
  }
}
