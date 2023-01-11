const jsonServer = require('json-server');
const querystring = require('node:querystring');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now();
        req.body.updatedAt = Date.now();
    }

    if (req.method === 'PATCH') {
        req.body.updatedAt = Date.now();
    }
    // Continue to JSON Server router
    next();
});

router.render = (req, res) => {
    const headers = res.getHeaders();
    const totalCount = headers['x-total-count'];
    if (req.originalMethod === 'GET' && totalCount) {
        const queryParams = querystring.parse(req._parsedOriginalUrl.query);
        const default_limit = 24;
        const currentPage = Number.parseInt(queryParams._page) || 1;
        const totalItemsPerPage = Number.parseInt(queryParams._limit) || default_limit;
        const totalItems = Number.parseInt(totalCount);
        const totalPages = Math.ceil(totalItems / _limit);
        const result = {
            data: res.locals.data,
            pagination: {
                totalItems,
                totalItemsPerPage,
                currentPage,
                totalPages,
            },
        };
        return res.jsonp(result);
    }
    res.jsonp(res.locals.data);
};

// Use default router
const PORT = process.env.PORT || 3099;
server.use('/api', router);
server.listen(PORT, () => {
    console.log('JSON Server is running');
});
