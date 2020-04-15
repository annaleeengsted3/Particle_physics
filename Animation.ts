import { Settings } from "./Settings";
import { SimpleEventDispatcher } from "strongly-typed-events";

export default class Animation {
  public isLooping: boolean = true;

  private _onNewSettings = new SimpleEventDispatcher<Settings>();
  public get onNewSetting() {
    return this._onNewSettings.asEvent();
  }

  private _isAnimating: boolean = false;
  private _currentIndex: number = 0;
  private _nextIndex: number = 0;
  private _numOfAnimationsPlayed: number = 0;
  private _currentTimeout: NodeJS.Timeout;
  private _animations: AnimationItem[] = [];

  public pushSetting(setting: Settings, time: number) {
    this._animations.push(new AnimationItem(setting, time));
  }

  public start() {
    if (this._isAnimating) {
      return;
    }

    this._isAnimating = true;
    this.playNextSetting();
  }

  public stop() {
    clearTimeout(this._currentTimeout);
    this._isAnimating = false;
  }

  private playNextSetting = (autoQeueuNext: boolean = true) => {
    clearTimeout(this._currentTimeout);
    const playSettings: Settings = this._animations[this._nextIndex].settings;
    this._currentIndex = this._nextIndex;
    let timeInMS: number = this._animations[this._currentIndex].time * 1000;
    this._nextIndex = (this._currentIndex + 1) % this._animations.length;
    this._onNewSettings.dispatch(playSettings);
    this._numOfAnimationsPlayed++;

    if (
      !this.isLooping &&
      this._numOfAnimationsPlayed >= this._animations.length
    ) {
      this.stop();
    }

    if (autoQeueuNext) {
      this._currentTimeout = setTimeout(this.playNextSetting, timeInMS);
    }
  };
}

export class AnimationItem {
  public readonly settings: Settings;
  public readonly time: number;

  constructor(settings: Settings, time: number) {
    this.settings = settings;
    this.time = time;
  }
}
