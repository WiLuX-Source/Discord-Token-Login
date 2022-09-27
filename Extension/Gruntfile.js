// eslint-disable-next-line no-undef
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'json-replace': {
            Firefox: {
                options: {
                    space: '\t',
                    replace: {
                        version: '<%= pkg.version %>',
                        description: '<%= pkg.description %>',
                        permissions: [
                            'tabs',
                            'downloads',
                            'contextMenus',
                            'storage',
                            '*://discord.com/*',
                            'webRequest',
                            'webRequestBlocking'
                        ],
                    }
                },
                files: [{
                    src: 'mv2.json', // manifest.json for mv3
                    dest: 'manifest.<%= grunt.task.current.target %>.json'
                }]
            },
            Chromium: {
                options: {
                    space: '\t',
                    replace: {
                        version: '<%= pkg.version %>',
                        description: '<%= pkg.description %>',
                        permissions: [
                            'tabs',
                            'downloads',
                            'contentSettings',
                            'contextMenus',
                            'storage'
                        ],
                    }
                },
                files: [{
                    src: 'manifest.json',
                    dest: 'manifest.<%= grunt.task.current.target %>.json'
                }]
            },
        },
        clean: {
            Firefox: ['build/<%= grunt.task.current.target %>','manifest.<%= grunt.task.current.target %>.json'],
            Chromium: ['build/<%= grunt.task.current.target %>','manifest.<%= grunt.task.current.target %>.json'],
            dist: ['dist']
        },
        copy: {
            Firefox: {
                files: [
                    { expand: true, src: ['contentscript.js'], dest: 'build/<%= grunt.task.current.target %>/', filter: 'isFile' },
                    { expand: true, src: ['icons/**'], dest: 'build/<%= grunt.task.current.target %>/' },
                    { expand: true, src: ['fonts/**'], dest: 'build/<%= grunt.task.current.target %>/' },
                    { expand: true, cwd: 'Firefox/', src: ['**'], dest: 'build/<%= grunt.task.current.target %>/' },
                    {
                        expand: true,
                        src: 'manifest.<%= grunt.task.current.target %>.json',
                        dest: 'build/<%= grunt.task.current.target %>/',
                        filter: 'isFile',
                        rename: function(dest, src) {
                            return dest + src.replace('.' + grunt.task.current.target,'');
                        }
                    },
                ],
                options:  {
                    noProcess: ['icons/**','fonts/**','Firefox/**'],
                    process: function (content,srcpath) {
                        if (srcpath.includes('contentscript.js')) return content.replaceAll('chrome','browser');
                        if (srcpath.includes('manifest')) {
                            let mn = JSON.parse(content);
                            mn.browser_specific_settings = {
                                gecko : {
                                    id: 'tokenlogin@id.com'
                                }
                            };
                            return content = JSON.stringify(mn);
                    }
                      },
                      
                }
            },
            Chromium: {
                files: [
                    { expand: true, src: ['contentscript.js'], dest: 'build/<%= grunt.task.current.target %>/', filter: 'isFile' },
                    { expand: true, src: ['icons/**'], dest: 'build/<%= grunt.task.current.target %>/' },
                    { expand: true, src: ['fonts/**'], dest: 'build/<%= grunt.task.current.target %>/' },
                    { expand: true, cwd: 'Chromium/', src: ['**'], dest: 'build/<%= grunt.task.current.target %>/' },
                    {
                        expand: true,
                        src: 'manifest.<%= grunt.task.current.target %>.json',
                        dest: 'build/<%= grunt.task.current.target %>/',
                        filter: 'isFile',
                        rename: function(dest, src) {
                            return dest + src.replace('.' + grunt.task.current.target,'');
                        }
                    },
                ]
            },
        },
        removelogging: {
            dist: {
                src: 'build/**/*.js'
            }
        },
        compress: {
            Firefox: {
                options: {
                    archive: 'dist/<%= pkg.name %>-<%= grunt.task.current.target %>-<%= pkg.version %>.zip'
                },
                files: [
                    { expand: true, cwd: 'build/<%= grunt.task.current.target %>/', src: ['**'], dest: '/' }
                ]
            },
            Chromium: {
                options: {
                    archive: 'dist/<%= pkg.name %>-<%= grunt.task.current.target %>-<%= pkg.version %>.zip'
                },
                files: [
                    { expand: true, cwd: 'build/<%= grunt.task.current.target %>/', src: ['**'], dest: '/' }
                ]
            },
        }
    });
    grunt.loadNpmTasks('grunt-json-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-remove-logging');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('buildChromium', ['json-replace:Chromium', 'copy:Chromium', 'removelogging']);
    //grunt.registerTask('buildFirefox', ['json-replace:Firefox', 'copy:Firefox', 'removelogging']);
    grunt.registerTask('buildFirefoxmv2', ['json-replace:Firefox', 'copy:Firefox', 'removelogging']);
    grunt.registerTask('cleanall', ['clean']);
    grunt.registerTask('zipChromium', ['compress:Chromium']);
    grunt.registerTask('zipFirefox', ['compress:Firefox']);
};