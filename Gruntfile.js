module.exports = function (grunt) {
var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    pkg: pkg,
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/sp_setup.js', 'src/rule.js'],
        dest: 'dist/bundle.js',
      },
    },
    removelogging:{
      build: {
        src:'dist/bundle.js',
        dest:'dist/bundle.nolog.js'
      },
      options:{
        namespace:['console']
      }
    },
    uglify:{
      options:{
        banner: '//compressed version of sp_setup.js'
      },
        build:{
          src: 'dist/bundle.nolog.js',
          dest: 'dist/bundle.min.js'
        }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-remove-logging');

  grunt.registerTask('default', ['concat', 'removelogging', 'uglify']);
};
