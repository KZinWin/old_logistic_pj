module.exports = {
    project: {
      ios: {},
      android: {}, // grouped into "project"
    },
    'react-native-maps': {
        platforms: {
          android: null, // disable Android platform, other platforms will still autolink if provided
        },
      },
    assets: ['./assets/fonts'], // stays the same
    // commands: require('./path-to-commands.js'), // formerly "plugin", returns an array of commands
  };