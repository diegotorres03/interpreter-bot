
export interface BotPhrasesJSON {
    botName: string
    botUrl: 'http://localhost:1807',
    regex?: {
        ['en']: string[]
        ['es']: string[]
    }
}

export const registeredBotPhrases: BotPhrasesJSON[] = [
    {
        botName: 'conversation',
        botUrl: 'http://localhost:1807',
        regex: {
            es: [
                // greetings
                'hola',
                'buenos dias',
                'buenas tardes',
                'oelo parce',

                // goodby
                'hasta luego',
                'chao',
                'nos vemos',
                'todobien',
                'todo bien',
                'que descances',

                // statusReport
                'como va la cosa?',
                'como vas\?',
                'que tal\?',
                'como estas\?',
                'bien y tu|usted|vos\?',

                // generalHelp
                'que puedo hacer\?',
                'que puedes hacer\?',
                'vos que haces\?',
                'ayuda\?',
                'no se que hacer\?',
            ],
            en: [
            ],
        },
    },
    {
        botName: 'list',
        botUrl: 'http://localhost:1807',
        regex: {
            en: [
                'add (\w+) to my (todo|shopping)',
                'add (\w+) to my (todo|shopping) list',
            ],
            es: [
                'agrega (\w+) al todo',
                'agrega (\w+) al todo list',
                'agrega (\w+) a la lista de todo',

                'agrega (\w+) al mercado',
                'agrega (\w+) a la lista de mercado',
            ]
        }
    },
    {
        botName: 'trademinator',
        botUrl: 'http://localhost:1807',
        regex: {
            en: [

                // buy
                'buy (\d+) (eth|btc|ltc|usdt) at (\d+%)',
                'buy (\d+) (eth|btc|ltc|usdt)',

                // sell
                'sell (\d+) (eth|btc|ltc|usdt) at (\d+%)',
                'sell (\d+) (eth|btc|ltc|usdt)',

                // send
                'send (\d+) (eth|btc|ltc|usdt) to (\w+)',
            ],
            es: [
                // buy
                'compre|compra|comprar (\d+) (eth|btc|ltc|usdt) al (\d+%)',
                'compre|compra|comprar (\d+) (eth|btc|ltc|usdt)',
                'compre|compra|comprar crypto|cryptomonedas',

                // sell
                'venda|vende|vender (\d+) (eth|btc|ltc|usdt) al (\d+%)',
                'venda|vende|vender (\d+) (eth|btc|ltc|usdt)',
                'venda|vende|vender crypto|cryptomonedas',

                // send
                'mandale (\d+) (eth|btc|ltc|usdt) a (\w+)',
                'mandele (\d+) (eth|btc|ltc|usdt) a (\w+)',

            ]
        }
    },
]

