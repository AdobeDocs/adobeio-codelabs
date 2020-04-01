const fetch = require('node-fetch');
const {Core} = require('@adobe/aio-sdk');
const index = require('../index.json');
const secret = require('./secret.json');

async function main(params) {
  const logger = Core.Logger('main', {level: params.LOG_LEVEL});
  
  try {
    const query = params.q || '';
    const type = params.type || '';
    const limit = params.limit || 40;
    const sort = params.sort || '';
    
    const repos = index
                    .filter(meta => meta.repo && (type ? meta.type === type : true))
                    .map(meta => `repo:${meta.repo.split('/').slice(-2).join('/')}`)
                    .join('+');
    // todo verify v4 API with GraphQL
    const search = await fetch(`https://api.github.com/search/code?q=${repos}+extension:md+in:file+${query}&per_page=${limit}&sort=${sort}`, {
      headers: {
        'user-agent': 'node.js',
        'Authorization': `token ${secret.token}`
      }
    });
  
    const res = await search.json();
    
    const data = {
      count: res.total_count,
      items: []
    };
    
    const lowerCasedQuery = query.toLowerCase();
    index
      .filter(meta => !meta.repo &&
        (type ? meta.type === type : true) &&
        (meta.title.toLowerCase().includes(lowerCasedQuery) || meta.description.toLowerCase().includes(lowerCasedQuery)))
      .forEach((meta) => {
        data.count++;
        data.items.push({
          title: meta.title,
          url: meta.url,
          description: meta.description,
          files: []
        });
      });

    for (const item of res.items) {
      const find = data.items.find(meta => meta.title === item.repository.full_name);
      if (find) {
        find.files.push({
          title: item.path,
          url: item.html_url
        });
      }
      else {
        data.items.push({
          title: item.repository.full_name,
          url: item.repository.html_url,
          description: item.repository.description,
          files: [{
            title: item.path,
            url: item.html_url
          }]
        });
      }
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {res: data}
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