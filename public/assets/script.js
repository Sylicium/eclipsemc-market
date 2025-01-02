

(async () => {
    let socket = null;


    const Elements = {
        bountyList: document.getElementById('bounty-list'),
        marketList: document.getElementById('market-list'),
        blockMarketList: document.getElementById('block-market-list'),
    }


    const Divs = {
        bounty: (bounty) => {
            /*
            bounty = {
                _id: string,
                target: string
                author: string,
                reward: number
                note: string,
            }
            */
            let e = document.createElement('div');
            e.classList.add('bounty');
            e.classList.add(`bounty-id-${bounty.id}`);
            e.innerHTML = `
                <p><strong>Target:</strong> <span class="data-target" style="color: #ffc107;">Loading...</span></p>
                <p><strong>Requested By:</strong> <span class="data-author">Loading...</span></p>
                <p><strong>Bounty:</strong> <span style="font-size: 1.5rem; color: #ffc107;">$<span class="data-reward">Loading...</span></span></p>
                <p><strong>Note:</strong>&nbsp;<span class="data-note">Loading...</span></p>
            `
            e.querySelector('.data-target').innerText = bounty.target;
            e.querySelector('.data-author').innerText = bounty.author;
            e.querySelector('.data-reward').innerText = bounty.reward;
            e.querySelector('.data-note').innerText = bounty.note;
            return e;
        },
        market: (marketItem) => {
            /*
            market = {
                _id: string,
                item: string,
                price: number,
                quantity: number,
                stock: number,
            }
            */
            let e = document.createElement('div');
            e.classList.add('item-card');
            e.classList.add(`marketitem-id-${marketItem.id}`);
            e.innerHTML = `
            <h2><span class="data-item">Loading...</span> (x<span class="data-quantity">?</span>)</h2>
            <p class="price">Price: $<span class="data-price">???</span></p>
            <p class="stock">Stock: <spans class="data-stock available"></span></p>
            `
            e.querySelector('.data-item').innerText = marketItem.item;
            e.querySelector('.data-price').innerText = marketItem.price;
            e.querySelector('.data-quantity').innerText = marketItem.quantity;
            if(marketItem.stock >= 1 || marketItem.stock === -1) {
                e.querySelector('.data-stock').innerText = marketItem.stock === -1 ? '♾️' : marketItem.stock;
                e.querySelector('.data-stock').classList.remove('out-of-stock');
                e.querySelector('.data-stock').classList.add('available');
            } else {
                e.querySelector('.data-stock').innerText = 'Out of Stock';
                e.querySelector('.data-stock').classList.remove('available');
                e.querySelector('.data-stock').classList.add('out-of-stock');
            }
            return e;
        },
        blockMarket: (blockMarketItem) => {
            return this.market(blockMarketItem);
        }
    }



    window.addEventListener('load', () => {
        console.log('Page loaded');
        refreshBouties();
        refreshMarket();
        refreshBlockMarket();
    })

    function refreshBouties() {
        fetch('/api/bounty').then(res => res.json()).then(data => {
            console.log("/api/bounty", data);
            Elements.bountyList.innerHTML = '';
            data.forEach(bounty => {
                Elements.bountyList.appendChild(Divs.bounty(bounty));
            });
        });
    }

    function refreshMarket() {
        fetch('/api/market').then(res => res.json()).then(data => {
            console.log("/api/market", data);
            Elements.marketList.innerHTML = '';
            data.forEach(marketItem => {
                Elements.marketList.appendChild(Divs.market(marketItem));
            });
        });
    }

    function refreshBlockMarket() {
        fetch('/api/block-market').then(res => res.json()).then(data => {
            console.log("/api/block-market", data);
            Elements.blockMarketList.innerHTML = '';
            data.forEach(blockMarketItem => {
                Elements.blockMarketList.appendChild(Divs.blockMarket(blockMarketItem));
            });
        });
    }

})();