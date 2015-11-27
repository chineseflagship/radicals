(function () {
    'use strict';

    module.exports = function (grunt) {

        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            concat: {
                js: {
                    src: [
                        'bower_components/hanzi-writer/dist/hanzi-writer.js',
                        'bower_components/hanzi-writer/dist/data/all.js'
                    ],
                    dest: 'js/libraries.js'
                }
            },
            uglify: {
                js: {
                    src: '<%= concat.js.dest %>',
                    dest: '<%= concat.js.dest %>'
                }
            },
            sass: {
                options: {
                    sourceMap: true
                },
                dist: {
                    files: {
                        'css/index.css': 'sass/index.scss'
                    }
                }
            },
            cssmin: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1
                },
                release: {
                    files: {
                        'css/index.css': ['css/index.css']
                    }
                }
            },
            watch: {
                gruntfile: {
                    files: '<%= jshint.gruntfile.src %>',
                    tasks: ['jshint:gruntfile']
                }
            }
        });

        // These plugins provide necessary tasks.
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-sass');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-cssmin');

        grunt.registerTask('default', ['sass', 'concat', 'uglify', 'cssmin']);

    };
})();
