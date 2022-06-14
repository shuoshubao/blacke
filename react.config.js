module.exports = ({ isDevelopment, isProduction }) => {
  let publicPath = '/'

  if (isProduction) {
    publicPath = './dist/'
  }

  return {
    publicPath,
    configureWebpack: {
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        antd: 'antd',
        moment: 'moment',
        lodash: '_'
      }
    },
    assets: {
      css: ['https://file.ljcdn.com/bs/antd/4.18.7/dist/antd.dark.min.css'],
      js: [
        'https://file.ljcdn.com/bs/lodash/4.17.21/lodash.min.js',
        `https://file.ljcdn.com/bs/react/17.0.2/umd/${
          isDevelopment ? 'react.development.js' : 'react.production.min.js'
        }`,
        `https://file.ljcdn.com/bs/react-dom/17.0.2/umd/${
          isDevelopment ? 'react-dom.development.js' : 'react-dom.production.min.js'
        }`,
        'https://file.ljcdn.com/bs/moment/2.25.3/min/moment.min.js',
        'https://file.ljcdn.com/bs/antd/4.18.7/dist/antd.min.js'
      ]
    }
  }
}
