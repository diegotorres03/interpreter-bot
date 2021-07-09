
export const phrases = {
    greetings: {
        es: [
            /hola/i,
            /buenos dias/i,
            /buenas tardes/i,
            /oelo parce/i,
        ],
    },
    goodby: {
        es: [
            /hasta luego/i,
            /chao/i,
            /nos vemos/i,
            /todobien/i,
            /todo bien/i,
            /que descances/i,
        ],
    },
    statusReport: {
        es: [
            /como va la cosa?/i,
            /como vas\?/i,
            /que tal\?/i,
            /como estas\?/i,
            /bien y tu|usted|vos\?/i,

        ],
    },
    generalHelp: {
        es: [
            /que puedo hacer\?/i,
            /que puedes hacer\?/i,
            /vos que haces\?/i,
            /ayuda\?/i,
            /no se que hacer\?/i,
            //i,
        ],
    },

    todo: {
        es: [
            /agrega (\w+) al todo/i,
            /agrega (\w+) al todo list/i,
        ], 
        en: [
            /add (\w+) to my todo/i,
            /add (\w+) to my todo list/i,
        ]
    },

    shooping: {

    },

    remainders: {
        
    },

    sendCrypto: {
        es: [
            /mandale (\d+) (eth|btc|ltc|usdt) a (\w+)/i,
            /mandele (\d+) (eth|btc|ltc|usdt) a (\w+)/i,
        ],
        en: [
            /send (\d+) (eth|btc|ltc|usdt) to (\w+)/i,
        ]
    },

    buyCrypto: {
        es: [
            /compre|compra|comprar (\d+) (eth|btc|ltc|usdt) al (\d+%)/i,
            /compre|compra|comprar (\d+) (eth|btc|ltc|usdt)/i,
            /compre|compra|comprar crypto|cryptomonedas/i,
            //i,
        ],
        en: [
            /buy (\d+) (eth|btc|ltc|usdt) at (\d+%)/i,
            /buy (\d+) (eth|btc|ltc|usdt)/i,
        ],
    },
    sellCrypto: {
        es: [
            // new RegExp(`venda (\d+) (${commomRegex.coins}) at (\d+%)`, 'i'),
            /venda|vende|vender (\d+) (eth|btc|ltc|usdt) al (\d+%)/i,
            /venda|vende|vender (\d+) (eth|btc|ltc|usdt)/i,
            /venda|vende|vender crypto|cryptomonedas/i,
            //i,
        ],
        en: [
            // new RegExp(`sell (\d+) (${commomRegex.coins}) at (\d+%)`, 'i'),
            /sell (\d+) (eth|btc|ltc|usdt) at (\d+%)/i,
            /sell (\d+) (eth|btc|ltc|usdt)/i,
            //i,
        ],
    },

    // orderStatus: {
    //     es: [
    //         /como va mi order de (eth|ltc|btc)/i,
    //         /si se (vendieron|compraron) mis crypto|cryptomodendas|eth|ltc|usdt/i,
    //         //i,
    //         //i,
    //     ],
    //     en: [],
    // },


    dcaBuy: {
        es: [
            /corra dca en ethusdt/i,
        ],
        en: [
            /run dca on ethusdt/i,
        ],
    },
    dcaSell: {
        es: [
            /corra dca en ethusdt/i,
        ],
        en: [
            /run dca on ethusdt/i,
        ],
    },

}