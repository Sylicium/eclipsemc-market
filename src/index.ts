
// Simple express server takes pages into /public folder without using .use

import express from 'express';
import path from 'path';
import CONFIG from './config.js';
import fs from 'fs';

import { Database } from './dbReader.js';

const __dirname = path.resolve(path.dirname(".")) // From were the script is run

const app = express();
app.use(express.json());

const publicPath = path.resolve(__dirname, 'public');
console.log("__dirname", __dirname);
console.log("publicPath", publicPath);



app.get('/api/bounty/delete/:id', (req, res) => {
    const id = req.params.id;
    if(!id || typeof id !== 'string') {
        // return invalid datas
        res.send({
            status: 400,
            message: "Invalid Data"
        })
        return;
    }
    Database.removeBounty(parseInt(id));
    res.send({
        status: 200,
        message: "Bounty Deleted"
    })
})

app.get('/api/bounty/add', (_req, res) => {
    res.send({
        status: 200,
        message: "Add Market Item",
        format: {
            target: "string",
            author: "string",
            reward: "number",
            note: "string",
        }
    })
    return;
})
app.post('/api/bounty/add', (req, res) => {
    try {
        const { target, author, reward, note } = req.body;
        if(!target || !author || !reward || note == null) {
            // return invalid datas
            res.send({
                status: 400,
                message: "Invalid Data"
            })
            return;
        }

        // Check types to validate user input
        // Allow only letters, numbers, and special characters
        const onlyChars = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/;
        const onlyCharsAndSpace = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-\s]+$/;

        const checks = {
            target: target.match(onlyChars),
            author: author.match(onlyChars),
            note: note.match(onlyCharsAndSpace)
        }

        if(!checks.target || !checks.author || !checks.note) {
            res.send({
                status: 400,
                message: "Invalid Data",
                checks: [checks.target, checks.author, checks.note]
            })
            return;
        }

        Database.addBounty({
            target,
            author,
            reward,
            note
        });
        res.send({
            status: 200,
            message: "Bounty Added"
        })
    } catch(e) {
        console.log(e);
        res.send({
            status: 500,
            message: "Internal Server Error"
        })
    }

})


app.get('/api/market/add', (_req, res) => {
    res.send({
        status: 200,
        message: "Add Market Item",
        format: {
            item: "string",
            price: "number",
            quantity: "number",
            stock: "number",
        }
    })
    return;
})
app.post('/api/market/add', (req, res) => {
    console.log(`[/api/market/add] POST /api/market/add`, req.body);
    const { item, price, quantity, stock } = req.body;
    if(!item || !price || !quantity || !stock) {
        // return invalid datas
        res.send({
            status: 400,
            message: "Invalid Data"
        })
        return;
    }

    // Check types to validate user input
    // Allow only letters, numbers, and special characters
    const onlyChars = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/;

    if(!item.match(onlyChars)) {
        res.send({
            status: 400,
            message: "Invalid Data"
        })
        return;
    }

    Database.addMarketItem({
        item,
        price,
        quantity,
        stock
    });
    res.send({
        status: 200,
        message: "Item Added"
    })

})

app.get('/api/bounty', (_req, res) => {
    res.send(Database.getBounties());
})

app.get('/api/market', (_req, res) => {
    res.send(Database.getMarket());
})

app.get('/api/block-market', (_req, res) => {
    res.send(Database.getBlockMarket());
})

app.get('/', (_req, res) => {
    console.log(`GET /`);
    res.sendFile(path.join(publicPath, 'index.html'));
})


app.all('*', (_req, res): void => {
    console.log(`[*] ${_req.method} ${_req.path}`);
    if(_req.path.startsWith('/api')) {
        handleApi(_req, res);
        return
    }
    if(_req.path.startsWith('/assets/') && !(_req.path.includes('..'))) {
        console.log("yes");
        if(fs.existsSync(path.join(publicPath, _req.path))) {
            res.sendFile(path.join(publicPath, _req.path));
            return
        } else {
            res.send('404 Asset Not Found');
            return
        }
    }
    // send 404 page
    res.send('404 Page Not Found');
});


app.listen(CONFIG.port, () => {
    console.log(`Server is running on port ${CONFIG.port}`);
});


async function handleApi(_req: express.Request, res: express.Response) {

    res.send({
        status: 400,
        message: "Bad Request"
    })
    return;

}