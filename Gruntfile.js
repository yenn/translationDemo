/**
 * Created by yenn on 11/13/13.
 */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    'js/build/dist.min.js' : 'js/build/dist.js',
                    'js/build/plugins.min.js' : 'js/core/plugins.js'
                }
            }
        },
        concat: {
            dist: {
                src: ['js/core/core.js', 'js/core/exceptions.js', 'js/core/events.js', 'js/core/main.js'],
                dest: 'js/build/dist.js'
            },
            test: {
                src: ['js/core/core.js', 'js/core/exceptions.js',  'js/test/*.js'],
                dest: 'js/build/test.js'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['js/build/test.js']
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'js/*.js', 'js/test/*.js']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('test', 'Runs all tests', ['concat:test', 'mochaTest']);
    grunt.registerTask('lint', 'Checks code validity', ['jshint']);
    // Default task(s).
    grunt.registerTask('default', ['test', 'lint', 'concat:dist', 'uglify']);

};