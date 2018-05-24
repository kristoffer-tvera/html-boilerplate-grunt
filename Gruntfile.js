module.exports = function (grunt) {

    // configure the tasks
    var config = {
        //  Sass
        sass: {                              // Task
            expanded: {                            // Target
                options: {                       // Target options
                    outputStyle: 'expanded',
                    sourcemap: false,
                },
                files: {
                    'styling/site.css': 'styling/sass/main.scss',
                }
            },

            min: {
                options: {
                    outputStyle: 'compressed',
                    sourcemap: false
                },
                files: {
                    'styling/site.min.css': 'styling/sass/main.scss',
                }
            },
        },

        // PostCss Autoprefixer
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: [
                            'last 2 versions',
                            'Chrome >= 30',
                            'Firefox >= 30',
                            'ie >= 10',
                            'Safari >= 8']
                    })
                ]
            },
            expanded: {
                src: 'styling/site.css'
            },
            min: {
                src: 'styling/site.min.css'
            }
        },

        // Browser Sync integration
        browserSync: {
            bsFiles: ["script/*.js", "styling/*.css", "!**/node_modules/**/*"],
            options: {
                server: {
                    baseDir: "./" // make server from root dir
                },
                port: 8000,
                ui: {
                    port: 8080,
                    weinre: {
                        port: 9090
                    }
                },
                open: false
            }
        },

        //  Concat
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: [
                    "script/partials/Globals.js",
                    "script/partials/Eventlisteners.js",
                    "script/partials/Helperfunctions.js",
                    "script/partials/Main.js"
                ],
                // the location of the resulting JS file
                dest: 'script/site.js'
            },
            temp: {
                // the files to concatenate
                options: {
                    sourceMap: true,
                    sourceMapStyle: 'link'


                },
                src: [
                    "script/partials/Globals.js",
                    "script/partials/Eventlisteners.js",
                    "script/partials/Helperfunctions.js",
                    "script/partials/Main.js"
                ],
                // the location of the resulting JS file
                dest: 'script/main.js'
            },
        },

        //  Uglify
        uglify: {
            options: {
                // Use these options when debugging
                // mangle: false,
                // compress: false,
                // beautify: true

            },
            dist: {
                files: {
                    'script/site.min.js': ['script/site.js']
                }
            }
        },

        //  Clean
        clean: {
            temp: {
                src: ['temp/']
            },
        },

        //  Watch Files
        watch: {
            sass: {
                files: ['styling/sass/**/*'],
                tasks: ['sass_compile'],
                options: {
                    interrupt: false,
                    spawn: false,
                },
            },
            js: {
                files: ['script/**/*'],
                tasks: ['js_compile'],
                options: {
                    interrupt: false,
                    spawn: false,
                },
            }
        },


        //  Concurrent
        concurrent: {
            options: {
                logConcurrentOutput: true,
                limit: 10,
            },
            monitor: {
                tasks: ["sass_compile", "watch:sass",
                    "js_compile", "watch:js",
                    "notify:watching", 'server']
            },
        },

        //  Notifications
        notify: {
            watching: {
                options: {
                    enabled: true,
                    message: 'Watching Files!',
                    title: "replace me", // defaults to the name in package.json, or will use project directory's name
                    success: true, // whether successful grunt executions should be notified automatically
                    duration: 1 // the duration of notification in seconds, for `notify-send only
                }
            },

            sass_compile: {
                options: {
                    enabled: true,
                    message: 'Sass Compiled!',
                    title: "replace me",
                    success: true,
                    duration: 1
                }
            },

            server: {
                options: {
                    enabled: true,
                    message: 'Server Running!',
                    title: "replace me",
                    success: true,
                    duration: 1
                }
            }
        },
    };

    grunt.initConfig(config);

    // load the tasks
    // grunt.loadNpmTasks('grunt-gitinfo');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-browser-sync');

    // define the tasks
    grunt.registerTask(
        'release', [
            'sass:expanded',
            'sass:min',
            'postcss:expanded',
            'postcss:min',
            'concat:dist',
            'uglify:dist',
            'clean:temp'
        ]
    );

    grunt.registerTask('js_compile', ['concat:dist', 'uglify:dist']);
    grunt.registerTask('sass_compile', ['sass:expanded', 'sass:min', 'notify:sass_compile']);
    grunt.registerTask('server', ['browserSync', 'notify:server']);
    grunt.registerTask('monitor', ["concurrent:monitor"]);
    grunt.registerTask('travis', ['sass_compile']);
};