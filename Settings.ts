import SpawnPositions, {
  SpawnPosition,
  SpawnPositionRect,
  SpawnPositionLine,
  SpawnPositionTriangle,
  SpawnPositionExponential,
  SpawnPositionSineCurve,
  SpawnPositionAnimated,
  SpawnPositionCirc,
} from "./SpawnPositions";

export class Settings {
  public alphaInRatio: number = 0.15; //ved 15% af dens levetid
  public alphaOutRatio: number = 0.8; //ved 80% af dens levetid

  public speedCoefficient: number = 0.035; //Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.05; to get orbiting!
  public friction: number = 0.982; //jo tættere på 1, jo hurtigere.

  public vortexAngle: number = 0.45;
  public vortexForce: number = 0.9;
  public vortexDistortX: number = 3.4;
  public vortexDistortY: number = 1;

  public degreeOfEllipseStretch: number = 0.5;
  public explosionForce: number = -1300;

  public minSize: number = 1;
  public maxSize: number = 3;

  public minLifeSpan: number = 350;
  public maxLifeSpan: number = 450;
  public actuallLifeSpan: number;

  public mouseX: number;
  public mouseY: number;

  public canvasWidth: number;
  public canvasHeight: number;

  public spawnPoint: SpawnPositions;
  public spawnRate: {
    number: number;
    miliseconds: number;
    initialSpawns: number;
  } = { number: 5, miliseconds: 100, initialSpawns: 100 };

  constructor() {
    this.spawnPoint = new SpawnPositions();
  }

  public addSpawnPosition(spawnPoint: SpawnPosition) {
    this.spawnPoint.addSpawnPoint(spawnPoint);
  }

  public static DefaultOne(): Settings {
    const spec = new Settings();
    return spec;
  }

  public static DefaultTwo(): Settings {
    const spec = new Settings();
    spec.vortexAngle = 0;
    return spec;
  }

  public static DefaultThree(): Settings {
    const spec = new Settings();
    spec.vortexAngle = 0;
    spec.speedCoefficient = 0.5;
    spec.vortexDistortX = 0;
    spec.minLifeSpan = 800;
    spec.maxLifeSpan = 1200;
    spec.minSize = 3;
    spec.maxSize = 5;

    return spec;
  }

  public static DefaultFour(): Settings {
    const spec = new Settings();
    //spec.vortexAngle = 0;
    spec.vortexDistortX = 5.4;
    spec.vortexForce = 0.01;
    spec.speedCoefficient = 0.5;
    spec.friction = 0.8;
    spec.addSpawnPosition(new SpawnPositionAnimated(10, 100, 100));
    return spec;
  }

  public static DefaultFive(): Settings {
    const spec = new Settings();
    spec.speedCoefficient = 0.079;
    spec.friction = 0.812;
    spec.vortexAngle = -0.65;
    spec.vortexForce = 0.99;
    spec.vortexDistortY = 16.3;
    spec.vortexDistortX = 3;
    spec.addSpawnPosition(new SpawnPositionCirc(100, 0, 0, true));
    return spec;
  }

  public static DefaultSix(): Settings {
    const spec = new Settings();
    spec.alphaInRatio = 0;
    spec.vortexAngle = 0;
    spec.speedCoefficient = 2.7;
    spec.friction = 0.5;
    spec.vortexDistortX = 1;
    spec.vortexDistortY = 1;
    spec.explosionForce = -200;
    spec.addSpawnPosition(
      new SpawnPositionTriangle(100, 100, 150, 600, 500, 100)
    );

    return spec;
  }

  public static DefaultSeven(): Settings {
    const spec = new Settings();

    const spawnPointOne: SpawnPosition = new SpawnPositionRect(
      window.innerWidth * 0.5,
      window.innerHeight * 0.5,
      window.innerWidth * 0.5,
      window.innerHeight * 0.5
    );

    const spawnPointTwo: SpawnPosition = new SpawnPositionRect(
      0,
      0,
      window.innerWidth * 0.5,
      window.innerHeight * 0.5
    );

    spec.addSpawnPosition(spawnPointOne);
    spec.addSpawnPosition(spawnPointTwo);
    return spec;
  }

  public static DefaultEight(): Settings {
    const spec = new Settings();
    spec.vortexAngle = 0;
    spec.speedCoefficient = 0.5;
    spec.vortexDistortX = 0;
    spec.friction = 0.979;
    spec.degreeOfEllipseStretch = 0.2;
    spec.explosionForce = -800;
    spec.minSize = 3;
    spec.maxSize = 5;

    const spawnPointOne = new SpawnPositionRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight * 0.5
    );

    spec.addSpawnPosition(spawnPointOne);
    return spec;
  }

  public static DefaultNine(): Settings {
    const spec = new Settings();
    spec.alphaInRatio = 0;
    spec.vortexAngle = -0.45;
    spec.vortexDistortX = 1.05;
    spec.vortexDistortY = 2.4;
    // spec.addSpawnPosition(new SpawnPositionExponential(0.99, window.innerHeight - 100));
    spec.addSpawnPosition(new SpawnPositionSineCurve(100, 20));
    return spec;
  }
}
