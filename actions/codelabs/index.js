const {Core} = require('@adobe/aio-sdk');

const files = {
  'highlight.js': require('./scripts/highlight.min.js'),
  'typekit.js': require('./scripts/typekit.min.js'),
  'template.js': require('./templates/index.js'),
  'head.js': require('./templates/head.js'),
  'index.js': require('./scripts/index.js'),
  'index.css': require('./styles/index.js'),
  'head.css': require('./styles/head.js')
};

function main(params) {
  const logger = Core.Logger('main', {level: params.LOG_LEVEL});
  
  try {
    const file = files[params.file];
    if (!file) {
      return {
        statusCode: 400,
        body: {error: 'Invalid file'}
      }
    }
  
    if (params.file.endsWith('.js')) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/javascript'
        },
        body: '(' + file.toString() + ')()'
      };
    }
  
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/css'
      },
      body: file
    };
  }
  catch (e) {
    logger.error(e);
  
    return {
      statusCode: 500,
      body: {error: e.message}
    }
  }
}

exports.main = main;