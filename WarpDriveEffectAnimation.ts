import WarpdriveEffect from "./WarpdriveEffect";
import Animation from "./Animation";
import { Settings } from "./Settings";

export default class WarpDriveEffectAnimation extends WarpdriveEffect {
  private _animation: Animation;

  public setAnimation(animation: Animation) {
    if (this._animation) {
      this._animation.onNewSetting.unsub(this.onNewSetting);
    }
    this._animation = animation;

    this._animation.onNewSetting.sub(this.onNewSetting);
  }

  private onNewSetting = (setting: Settings) => {
    //this.setGlobalSpecs(setting);
    this.objectSpawner.setGlobalSpecs(setting);
  };
}
