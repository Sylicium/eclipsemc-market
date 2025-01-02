
// Simple express server takes pages into /public folder without using .use

import express from 'express';
import path from 'path';
import CONFIG from './config.js';
import fs from 'fs';

import { Database } from './dbReader.js';

const __dirname = path.resolve(path.dirname(".")) // From were the script is run

const app = express();

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

app.post('/api/bounty/add', (req, res) => {
    const { target, author, reward, note } = req.body;
    if(!target || !author || !reward || !note) {
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

    if(!target.match(onlyChars) || !author.match(onlyChars) || !note.match(onlyChars)) {
        res.send({
            status: 400,
            message: "Invalid Data"
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
    res.sendFile(path.join(publicPath, 'index.html'));

})


app.all('*', (_req, res): void => {
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