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

import * as _ from "lodash";

/**
 * Provides a singleton configuration class.
 */
export default class Config {
  /**
   * An instance of of Config class for singleton use.
   * @type {Configuration}
   */
  private static instance: Config = null;

  /**
   * Get the singleton instance of the configuration.
   * @returns {Config} Returns the configuration instance
   */
  public static getInstance(): Config {
    if (Config.instance == null) {
      Config.instance = new Config();
    }

    return Config.instance;
  }

  /**
   * Config storage.
   * @type {{}}
   */
  protected config: Object = {};

  /**
   * Process an object and add it to the configuration.
   * @param config Object to include
   */
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

  /**
   * Set a key to a particular value.
   * @param key Name of the key
   * @param value Value for the key
   */
  public set(key: string, value: any): void {
    _.set(this.config, key, value);
  }

  /**
   * Get a particular key or the instance of all configurations.
   * @param key Name of the key (optional)
   * @param fallback If key doesn't exist, return this value instead (optional)
   * @returns {any} Returns the value of a found key if key is set, all settings if no key set, or null on error
   */
  public get(key: string = null, fallback: any = null): any {
    return _.get(this.config, key, fallback);
  }

  /**
   * Unset a key by setting it to null.
   * @param key Name of the key
   */
  public unset(key: string): void {
    _.unset(this.config, key);
  }
}
