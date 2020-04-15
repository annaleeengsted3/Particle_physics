import { Themes } from "./Themes";
import { SimpleEventDispatcher } from "strongly-typed-events";

export default class MultipleImageLoader {
  private _onImagesLoaded = new SimpleEventDispatcher<MultipleImageLoader>();
  public get onImagesLoaded() {
    return this._onImagesLoaded.asEvent();
  }
  private _imageSrcs: string[] = [];
  private _numberOfImgs: number = 0;
  private _isLoaded: boolean = false;
  private _allImages: HTMLImageElement[] = [];

  public addSrcs(src: string) {
    this._imageSrcs.push(src);
  }

  public isLoaded() {
    return this._isLoaded;
  }

  public get getAllLoadedImages() {
    return this._allImages;
  }

  public async load() {
    if (this.isLoaded()) {
      return;
    }

    this._imageSrcs.forEach(source => {
      const image: HTMLImageElement = new Image();
      image.addEventListener("load", this.updateLoadStatus);
      image.src = source;
      this._allImages.push(image);
    });

    return new Promise(resolve => {
      if (this.isLoaded()) {
        resolve();
      } else {
        this.onImagesLoaded.one(() => {
          resolve();
        });
      }
    });
  }

  private updateLoadStatus = (event: Event) => {
    event.currentTarget.removeEventListener("load", this.updateLoadStatus);
    this._numberOfImgs++;
    if (this._numberOfImgs == this._imageSrcs.length) {
      this._isLoaded = true;
      this._onImagesLoaded.dispatch(this);
    }
  };
}
