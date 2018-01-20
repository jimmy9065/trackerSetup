module.exports = function (grunt) {
var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    pkg: pkg,
    removelogging:{
      build: {
        src:'src/sp_setup.js',
        dest:'dist/sp_setup.nolog.js'
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
          src: 'dist/sp_setup.nolog.js',
          dest: 'dist/bundle.js'
        }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-remove-logging')

  grunt.registerTask('default', ['removelogging', 'uglify']);
};
