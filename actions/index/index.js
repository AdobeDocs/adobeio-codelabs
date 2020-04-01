const index = require('../index.json');

async function main() {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify(index)
  };
}

exports.main = main;