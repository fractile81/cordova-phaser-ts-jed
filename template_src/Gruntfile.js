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

'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            build: [
                'www/**/*',
                '!www/.gitignore'
            ]
        },
        copy: {
            assets: {
                files: [
                    {
                        expand: true,
                        src: ['assets/**'],
                        dest: 'www'
                    }
                ]
            },
            html: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/html',
                        src: ['**'],
                        dest: 'www/',
                        filter: 'isFile'
                    }
                ]
            },
            jed: {
                files: [
                    {
                        expand: true,
                        cwd: 'node_modules/jed',
                        src: ['jed.js'],
                        dest: 'www/js',
                        filter: 'isFile'
                    }
                ]
            },
            phaser: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/phaser/build',
                        src: ['phaser.js'],
                        dest: 'www/js',
                        filter: 'isFile'
                    }
                ]
            }
        },
        express: {
            build: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    bases: ['www']
                }
            },
            dev: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    bases: ['www'],
                    livereload: true
                }
            }
        },
        open: {
            build: {
                path: 'http://localhost:<%= express.build.options.port%>'
            },
            dev: {
                path: 'http://localhost:<%= express.dev.options.port%>'
            }
        },
        po2json: {
            options: {
                format: 'jed',
                stringOnly: true
            },
            build: {
                src: ['src/translations/**/*.po'],
                dest: 'www/translations'
            }
        },
        ts: {
            build: {
                tsconfig: true,
                src: ['src/ts/**/*.ts'],
                out: 'www/js/main.js'
            }
        },
        tslint: {
            options: {
                configuration: 'tslint.json'
            },
            files: ['src/ts/**/*.ts']
        },
        watch: {
            assets: {
                files: ['assets/**'],
                tasks: ['copy:assets'],
                livereload: true
            },
            html: {
                files: ['src/html/**'],
                tasks: ['copy:html'],
                livereload: true
            },
            po2json: {
                files: ['src/translations/**/*.po'],
                tasks: ['po2json:build'],
                livereload: true
            },
            ts: {
                files: ['src/ts/**/*.ts'],
                tasks: ['ts:build'],
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-po2json');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tslint');

    grunt.registerTask('default', []);
    grunt.registerTask('build', ['clean:build', 'copy', 'ts:build', 'po2json:build']);
    grunt.registerTask('serve', ['express:build', 'open:build', 'express-keepalive']);
    grunt.registerTask('debug', ['express:dev', 'open:dev', 'watch']);
    grunt.registerTask('check', ['tslint']);
};
