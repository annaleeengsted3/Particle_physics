//Import for Webpack
// import "./ModuleWarpdrive.scss";
import { ColorTheme } from "./ColorTheme";
import { Themes } from "./Themes";
import { Settings } from "./Settings";
import Animation from "./Animation";
import WarpDriveEffectAnimation from "./WarpDriveEffectAnimation";

export default class ModuleWarpdrive {
  private effect: WarpDriveEffectAnimation;
  private allColorThemes: Themes = Themes.PresetOne();
  private chosenColorTheme: ColorTheme;
  private animation: Animation = new Animation();

  public build(): void {
    this.chosenColorTheme = this.allColorThemes.getNextTheme();

    this.effect = new WarpDriveEffectAnimation(
      this.chosenColorTheme,
      Settings.DefaultOne()
    );
    // this.getElement().appendChild(this.effect.canvas);
    document.querySelector(".Module-Warpdrive").appendChild(this.effect.canvas);

    this.animation.pushSetting(Settings.DefaultOne(), 4);
    this.animation.pushSetting(Settings.DefaultTwo(), 2.5);
    this.animation.pushSetting(Settings.DefaultThree(), 3);
    // const customSettings = new Settings();
    // customSettings.alphaInRatio = 0.5;
    // animation.pushSetting(customSettings, 1);

    this.effect.setAnimation(this.animation);
    this.animation.isLooping = true;
    // this.animation.start();
    // this.animation.stop();

    this.effect.setCanvasSize(window.innerWidth, window.innerHeight);
  }

  public awake(): void {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("keyup", this.onKeydown);
    document
      .querySelector("body")
      .addEventListener("mousemove", this.setDestination);
    document
      .querySelector("body")
      .addEventListener("mousedown", this.changeEffectDirection);
    document
      .querySelector("body")
      .addEventListener("mouseup", this.changeEffectDirection);
    this.effect.mouseX = window.innerWidth * 0.5;
    this.effect.mouseY = window.innerHeight * 0.5;
    this.effect.start();
  }

  public onResize = () => {
    this.effect.setCanvasSize(window.innerWidth, window.innerHeight);
  };

  private changeEffectDirection = () => {
    if (this.effect.isExploding == false) {
      this.effect.isExploding = true;
    } else {
      this.effect.isExploding = false;
    }
  };

  private onKeydown = (event: KeyboardEvent) => {
    let theme: ColorTheme;
    if (event.key == "n") {
      theme = this.allColorThemes.getNextTheme();
      this.effect.setColorTheme(theme);
    }
    if (event.key == "t") {
      theme = this.allColorThemes.getRandomTheme();
      this.effect.setColorTheme(theme);
    }
    if (event.key == "l") {
      this.animation.isLooping = this.animation.isLooping ? false : true;
    }
    if (event.key == "1") {
      this.effect.setGlobalSpecs(Settings.DefaultOne());
    }
    if (event.key == "2") {
      this.effect.setGlobalSpecs(Settings.DefaultTwo());
    }
    if (event.key == "3") {
      this.effect.setGlobalSpecs(Settings.DefaultThree());
    }
    if (event.key == "4") {
      this.effect.setGlobalSpecs(Settings.DefaultFour());
    }
    if (event.key == "5") {
      this.effect.setGlobalSpecs(Settings.DefaultFive());
    }
    if (event.key == "6") {
      this.effect.setGlobalSpecs(Settings.DefaultSix());
    }
    if (event.key == "7") {
      this.effect.setGlobalSpecs(Settings.DefaultSeven());
    }
    if (event.key == "8") {
      this.effect.setGlobalSpecs(Settings.DefaultEight());
    }
    if (event.key == "9") {
      this.effect.setGlobalSpecs(Settings.DefaultNine());
    }
  };

  private setDestination = (event: MouseEvent) => {
    this.effect.setMousePos(event.clientX, event.clientY);
  };

  protected sleep(): void {
    document
      .querySelector("body")
      .removeEventListener("mousemove", this.setDestination);
    document
      .querySelector("body")
      .removeEventListener("mousedown", this.changeEffectDirection);
    document
      .querySelector("body")
      .removeEventListener("mouseup", this.changeEffectDirection);
    window.removeEventListener("keydown", this.onKeydown);
    window.removeEventListener("resize", this.onResize);
  }
}
