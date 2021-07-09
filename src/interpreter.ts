import { ask, pick } from './utils'

import { botExpressions, errorExpressions, madExpressions } from './bot-expressions'
import { phrases } from './phrases'

let lang = 'es'

export const botPhrases = {
    greetings: {
        es: [
            `buenos dias`,
            `socio!! como va la cosa!!`,
            `hey! que mas`,
        ],
    },
    statusReport: {
        es: [
            `todo bien por este lado`,
            `bien bien, dandole duro`,
            `aca revisando las tareas del dia`,
            `listo pa camellar`,
        ],
    },
    generalHelp: {
        es: [
            `correr comandos`,
            `iniciar bots`,
            `agregarme cosas`,
            // ``,
        ],
    },
    sellCrypto: {
        es: [
            `vendiendo`,
            `a vender se dijo CARAJO!!!!`,
            `de una, vendiendo`,
            `como diga caballero, a vender se dijo`
        ],
    },
    buyCrypto: {
        es: [
            `comprando`,
        ],
    },
}

export const commomRegex = {
    coins: /eth|btc|ltc|usdt|cro|bnb|bat|cro/i,
}



export function findCategory(input: string) {
    console.log('finding category ------')
    const categories = Object.keys(phrases).filter(cat => {
        const exampleInUse = phrases[cat][lang].filter(example => {
            const matched = input.match(example)
            // matched && console.log(example, matched)
            return matched
        })
        return exampleInUse && exampleInUse.length > 0
    })
    return categories
}


let currentMessage = pick(botPhrases.greetings[lang])

const bots = []

export async function run(previousInput?, previousCategories?) {

    const botExpression = pick(botExpressions)

    const input = await ask(`${botExpression} ${previousInput}`, 'input')

    const categories = findCategory(input)
    console.log(categories)
    const responses = categories.map(cat => {
        try {
            return pick(botPhrases[cat][lang])
        } catch {
            return ''
        }
    })
    // console.log(responses)

    const tradeSingle = categories.findIndex(cat => cat === 'sellCrypto' || cat === 'buyCrypto') !== -1
    if (tradeSingle) {
        try {

            // const bot = await passToPlainBot(input)
            // bot.bot.onTransition(state => console.log('state', state.value, state.context.price))
            // bots.push(bot)
        } catch (err) {
            console.log('\nel error es aca')
            console.error(err)
            console.log('---------------------------')
            return run(`${pick(errorExpressions)} ${err.message}`)
        }
    }

    const exit = categories.findIndex(cat => cat === 'goodby') !== -1
    if (exit) return
    return run(pick(responses) || '')
}

// run(currentMessage)



