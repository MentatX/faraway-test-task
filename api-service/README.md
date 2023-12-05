Sample blockchain API service for *FaraWay* to serve events.

---

### Run

```bash

# Install nvm
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

# Restart terminal/ssh & install node
$ nvm install node

$ git clone ...

$ cd api-service

# Install node modules
$ npm install

# Pupulate secret configs
# See 'Config' section below
$ vim config/test/secret.json
$ vim config/development/secret.json

# Create new session
$ byobu new -s blank
$ byobu new -s blank-logs

# Run local development server
$ npm run wjs
```
**Config**

Populate *./config/[ENV]/secret.json* for your environment

```
{
  "provider-uri": "",
  "operator": {
      "private-key": "0x"
  }
}
```

### API

### Ping

```bash
curl --location --request GET 'http://localhost:3003/api/ping'
```

### Balance

*Request*
```bash
curl --location --request GET 'http://localhost:3003/api/balance?address=0x9030453F7E312e1eCA8C406D1204f01D2EF424Fa'
```

*Response*
```json
{
    "apiVersion": "0.1.0",
    "method": "GET::balance",
    "data": {
        "address": "0x9030453F7E312e1eCA8C406D1204f01D2EF424Fa",
        "balance": "5.119103794118997848"
    }
}
```


#### Info

*Request*
```bash
curl --location --request GET 'http://localhost:3003/api/info'
```

*Response*
```json
{
    "apiVersion": "0.1.0",
    "method": "GET::info",
    "data": {
        "operator": {
            "address": "0x44A9fA78D84401704e9e7F7BE169D0F079d9fe29",
            "balance": "0.0"
        },
        "contract": {
            "factory": {
                "address": "0x1907C22711488bCcdaA3583D853Bc87A583cf845",
                "collections": [
                    "0xDf43a26E086D738582b9A4B10Fb376E08b392e9D",
                    "0x7f651Cd375836F7E773fAFE5B759a0D9c01B8882",
                ]
            }
        }
    }
}
```

#### Events

*Request*
```bash
curl --location --request GET 'http://localhost:3003/api/events'
```

*Response*
```json
{
    "apiVersion": "0.1.0",
    "method": "GET::events",
    "data": {
        "collectionCreated": [
            [
                "0xd98f63741d4F3DE16bF4bdD8F8936038d499d8C1",
                "FaraWay Collection",
                "FWC",
                {
                  //...
                }
            ]
        ],
        "tokenMinted": [
            [
                "0xF711AFCB8164dCB3cC52a96Ae31C6755Adc94d03",
                "0xf0A3f91224d0a7f74c2C7751792a9829ea48d2D8",
                {
                    "_hex": "0x03ea",
                    "_isBigNumber": true
                },
                "faraway.com",
                {
                  // ...
                }
            ]
        ]
    }
}
```


### People

The original author of API Service is [Oleg Kuzmenko]()

E-Mail: [zeroflashgames@gmail.com](mailto:zeroflashgames@gmail.com)

### Copyright

© 2023