/*
 * Copyright 2016 Craig A. Hancock
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Config from "./config";
import * as States from "./states/states";

/**
 * A lightweight wrapper for game creation and configuration management.
 */
export class Main {
  /**
   * Instance of the Game.
   */
  protected game: Phaser.Game;

  /**
   * Store a pointer to the configuration.
   * @type {Configuration}
   */
  protected config: Config = Config.getInstance();

  /**
   * Default values to include as part of the configuration.
   * @type {{}}
   */
  private defaults: Object = {};

  /**
   * Constructor which incorporates configuration options and instantiates the Phaser Game app.
   * @param config
   */
  constructor(config: {platforms?: {}, platform?: string} = {}) {
    // Setup our configuration information
    this.config.process(this.defaults);

    // Screen platform-specific configurations into config.platform
    if (config.hasOwnProperty("platforms")) {
      // Keep track of platform configurations
      let platforms = config.platforms;
      delete config.platforms;

      // Removed platforms so that what exists are the defaults
      this.config.process(config);

      // Find the target platform, default to browser (since that's where the build is tested)
      let platformTarget = "browser";

      if (config.hasOwnProperty("platform")) {
        platformTarget = config.platform;
      } else if (window.hasOwnProperty("device") && window.device) {
        platformTarget = window.device.platform.toLowerCase();
      }

      if (platforms.hasOwnProperty(platformTarget)) {
        this.config.process(platforms[platformTarget]);
      }
    } else {
      // No platform-specific configurations
      this.config.process(config);
    }

    // Create the game object
    this.game = new Phaser.Game(this.config.get("viewport.width"), this.config.get("viewport.height"), Phaser.AUTO, "container", this);
  }

  /**
   * Preload any necessary assets before moving to the Boot state.
   */
  public preload(): void {}

  /**
   * Used to execute once the preload() method is called.
   */
  public create(): void {
    // If a statusbar plugin is provided, let's hide it
    if (window.hasOwnProperty("StatusBar")) {
      window.StatusBar.hide();
    }

    // Set the fullscreen scaling option
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    // Define all of the game states we plan to use
    this.game.state.add("Boot", States.Boot);
    this.game.state.add("Preload", States.Preload);

    // Change to the Boot state to start the real work
    this.game.state.start("Boot");
  }
}
