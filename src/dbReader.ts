
import fs from 'fs';
import * as SF from 'somefunctions'

const filePath = './DataBase.json';


type Bounty = {
    _id: string,
    target: string
    author: string,
    reward: number
    note: string,
}

type marketItem = {
    _id: string,
    item: string,
    price: number,
    quantity: number,
    stock: number,
}

type blockMarketItem = {
    _id: string,
    items: Array<{
        item: string,
        amount: number,
    }>,
    vsItems: Array<{
        item: string,
        amount: number,
    }>,
}

type Data = {
    bounties: Bounty[],
    market: marketItem[],
    blockMarket: blockMarketItem[],
}


const DefaultDatas: Data = {
    bounties: [
        {
            _id: "9dd25e6f",
            target: 'ShivKid',
            author: 'Nemesis1',
            reward: 40000,
            note: 'Bring me back his armor set',
        }
    ],
    market: [
        {
            _id: "dc4949d4",
            item: 'Ender Pearl',
            price: 400,
            quantity: 16,
            stock: -1,
        },
    ],
    blockMarket: [
        {
            _id: "96fa2c1c",
            items: [
                {
                    item: 'Diamond',
                    amount: 1,
                }
            ],
            vsItems: [
                {
                    item: 'Iron Ingot',
                    amount: 9,
                }
            ]
        }
    ]
}


class DBReader_class {
    private data: Data;
    constructor() {
        if(!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(DefaultDatas));
        }
        this.data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    }

    public getBounties() {
        return this.data.bounties;
    }

    public getMarket() {
        return this.data.market;
    }
    
    public getBlockMarket() {
        return this.data.blockMarket;
    }

    private save() {
        fs.writeFileSync(filePath, JSON.stringify(this.data));
    }

    public addBounty(bounty: {
        target: string,
        author: string,
        reward: number,
        note: string,
    }) {
        let _bounty = {
            _id: SF.Random.randHex(6),
            ...bounty
        }
        this.data.bounties.push(_bounty);
        this.save();
    }


    public addMarketItem(item: {
        item: string,
        price: number,
        quantity: number,
        stock: number,
    }) {
        let _item = {
            _id: SF.Random.randHex(6),
            ...item
        }
        this.data.market.push(_item);
        this.save();
    }

    public addBlockMarketItem(item: {
        items: Array<{
            item: string,
            amount: number,
        }>,
        vsItems: Array<{
            item: string,
            amount: number,
        }>,
    }) {
        let _item = {
            _id: SF.Random.randHex(8),
            ...item
        }
        this.data.blockMarket.push(_item);
        this.save();
    }

    public removeBounty(index: number) {
        this.data.bounties.splice(index, 1);
        this.save();
    }

    public removeMarketItem(index: number) {
        this.data.market.splice(index, 1);
        this.save();
    }

    public removeBlockMarketItem(index: number) {
        this.data.blockMarket.splice(index, 1);
        this.save();
    }


}

const Database = new DBReader_class();

export {
    Database
}