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

var path = require("path");
var fs = require("fs");

"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            build: [
                "./www/**/*"
            ],
            postinstall: [
                "./assets/.gitignore",
                "./assets/.npmignore",
                "./src/translations/.gitignore",
                "./src/translations/.npmignore",
                "./www/.gitignore",
                "./www/.npmignore"
            ]
        },
        copy: {
            assets: {
                files: [
                    {
                        expand: true,
                        src: ["./assets/**"],
                        dest: path.join(".", "www")
                    }
                ]
            },
            html: {
                files: [
                    {
                        expand: true,
                        cwd: path.join(".", "src", "html"),
                        src: ["**"],
                        dest: path.join(".", "www"),
                        filter: "isFile"
                    }
                ]
            },
            libs: {
                files: [
                    {
                        expand: true,
                        src: [
                            "./node_modules/jed/jed.js",
                            "./node_modules/phaser/build/phaser.js"
                        ],
                        dest: path.join(".", "www", "js"),
                        filter: "isFile",
                        flatten: true
                    }
                ]
            }
        },
        express: {
            default: {
                options: {
                    port: 9000,
                    hostname: "localhost",
                    bases: ["www"]
                }
            }
        },
        open: {
            default: {
                path: "http://<%= express.default.options.hostname %>:<%= express.default.options.port %>"
            }
        },
        po2json: {
            options: {
                format: "jed",
                stringOnly: true
            },
            build: {
                src: ["./src/translations/**/*.po"],
                dest: path.join(".", "www", "translations")
            }
        },
        tslint: {
            options: {
                configuration: "./tslint.json"
            },
            files: ["./src/ts/**/*.ts"]
        },
        typings: {
            install: {}
        },
        watch: {
            assets: {
                files: ["./assets/**"],
                tasks: ["copy:assets"],
                livereload: true
            },
            config: {
                files: ["./config.json"],
                tasks: ["process-config"],
                livereload: true
            },
            html: {
                files: ["./src/html/**"],
                tasks: ["copy:html"],
                livereload: true
            },
            po2json: {
                files: ["./src/translations/**/*.po"],
                tasks: ["po2json:build"],
                livereload: true
            },
            ts: {
                files: ["./src/ts/**/*.ts"],
                tasks: ["webpack:build"],
                livereload: true
            }
        },
        webpack: {
            build: require("./webpack.config.js")
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-express");
    grunt.loadNpmTasks("grunt-open");
    grunt.loadNpmTasks("grunt-po2json");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-typings");
    grunt.loadNpmTasks("grunt-webpack");

    grunt.registerTask("default", []);
    grunt.registerTask("build", ["clean:build", "copy", "webpack:build", "process-config", "po2json:build"]);
    grunt.registerTask('serve', ['express', 'express-keepalive']);
    grunt.registerTask('debug', ['express', 'watch']);
    grunt.registerTask("lint", ["tslint"]);

    grunt.registerTask("process-config", "Converts the config.json file into a usable JavaScript file for the app.", function () {
        var targetPath = path.join(".", "www", "js");
        var json = require("./config.json");
        var target = path.join(targetPath, "config.js");

        fs.writeFileSync(target, "window.appConfig = " + JSON.stringify(json) + ";");
    });
};
