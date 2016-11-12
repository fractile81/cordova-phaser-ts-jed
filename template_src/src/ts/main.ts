/*
 Copyright 2016 Craig A. Hancock

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

namespace App {
  export class Config {
    private static instance: Config = null;

    public static getInstance(): Config {
      if (Config.instance == null) {
        Config.instance = new Config();
      }

      return Config.instance;
    }

    protected config: Object = {};

    public process(config: Object): void {
      if (this.config === {}) {
        this.config = config;
      } else {
        for (let k in config) {
          if (config.hasOwnProperty(k)) {
            this.set(k, config[k]);
          }
        }
      }
    }

    public set(key: string, value: any): void {
      this.config[key] = value;
    }

    public get(key: string = null, fallback: any = null): any {
      if (key == null) {
        return this.config;
      }

      if (!this.config.hasOwnProperty(key)) {
        if (fallback != null) {
          return fallback;
        }

        return null;
      }

      return this.config[key];
    }

    unset(key: string) {
      this.config[key] = null;
    }
  }

  export class Main {
    protected game: Phaser.Game;
    protected config: Config = Config.getInstance();

    private defaults: Object = {
      width: 800,
      height: 600,
    };

    constructor(config: Object) {
      this.config.process(this.defaults);
      this.config.process(config);
      this.game = new Phaser.Game(this.config.get('width'), this.config.get('height'), Phaser.AUTO, 'container', this);
    }

    public preload(): void {

    }

    public create(): void {
      this.game.state.add('Boot', App.State.Boot);
      this.game.state.add('Preload', App.State.Preload);

      this.game.state.start('Boot');
    }
  }
}

window.onload = () => {
  // tslint:disable-next-line:no-unused-new no-unused-variable
  let app = new App.Main({width: 800, height: 600});
};
