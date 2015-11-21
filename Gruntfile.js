module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        clean: ['dist'],
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "staged/main.css": "src/**/*.less" // destination file and source file
                }
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src/',  src: ['**/*.js', '**/*.html'], dest: 'dist/'},
                    {expand: true, cwd: 'assets/',  src: ['**/*.svg', '**/*.gif', '**/*.png', '**/*.jpg'], dest: 'dist/'},
                    {expand: true, cwd: 'staged/',  src: ['*.css'], dest: 'dist/'}
                ]
            }
        },
        protractor: {
            options: {
                configFile: "node_modules/protractor/example/conf.js", // Default config file
                keepAlive: true, // If false, the grunt process stops when the test fails.
                noColor: false, // If true, protractor will not use colors in its output.
                args: {
                    // Arguments passed to the command
                }
            },
            e2etests: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
                options: {
                    configFile: "e2e-tests/protractor.conf.js", // Target-specific config file
                    args: {} // Target-specific arguments
                }
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js'
            }
        },
        connect: {
            options: {
                port: 8000,
                hostname: '0.0.0.0',
                livereload: 35729
            },
            livereload: {
                options: {
                    middleware:
                        function (connect) {
                            return [require('grunt-connect-proxy/lib/utils').proxyRequest, connect.static('dist/')];
                        }
                }
            },
            proxies: [{
                context: '/api',
                host: 'localhost',
                port: 8082,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                rewrite: { '^/api': '/' }
            }]
        },
        watch: {
            js: {
                files: ['src/**/*.js'],
                tasks: ['copy'],
                options: { livereload: true }
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['copy'],
                options: { livereload: true }
            },
            css: {
                files: ['src/**/*.less'],
                tasks: ['less', 'copy'],
                options: { livereload: true }
            }
        }
    });

    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['clean', 'less', 'copy']);
    grunt.registerTask('serve', ['default', 'configureProxies:server', 'connect:livereload', 'watch']);
    grunt.registerTask('e2e-tests', ['default', 'connect', 'protractor']);
    grunt.registerTask('unit-tests', ['clean', 'karma']);
};