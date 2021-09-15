import packageJSON from '../package.json';

module.exports = {
  app: {
    name: "Vishal's App",
    version: packageJSON.version,
    title: 'Techracers Traning Management System',
    description: packageJSON.description
  },

  dir_structure: {
    models: '../app/models/**/*.js',
    routes: '../app/routes/**/*Routes.js',
    controllers: '../app/conrollers/**/*Controller.js'
  },

};
