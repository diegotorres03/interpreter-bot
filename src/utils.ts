import { prompt } from 'inquirer'

export async function wait(time: number = 1000) {
    return new Promise(resolve => setTimeout(resolve, time))
}


export async function ask(question: string, type: string, choices?: Array<string>) {
    await Promise.resolve()
    const res = await prompt([{
        message: question,
        name: 'q',
        type,
        choices,
    }])
    return res.q
}



export function pick(options: Array<any>) {
    if (!options || !Array.isArray(options) || options.length === 0) return ''
    const randIndex = Math.floor(Math.random() * 100 % options.length)
    return options[randIndex]
}


export const coins = [
    'eth', 'btc', 'ltc', 'cro', 'usdt'
]

export function findCoin(input, coinList = coins) {
    const coinRegex = new RegExp(`${coinList.join('|')}`)
    const res = coinRegex.exec(input)
    // console.log(res)
    return res && res.shift() || null
}

export function findPercentage(input) {
    const coinRegex = /\d*\.?\d+%/i
    const res = coinRegex.exec(input)
    // console.log(res)
    return res && res.shift() || null
}

// (\d*\.?\d+)%
export function findAmount(input) {
    const regex = /(\d*\.?\d+) (eth|btc|ltc|usdt)/i
    const res = regex.exec(input)
    // console.log(res)
    return res && res[1] || null
}



export function findDirection(input) {
    return isBuy(input) ? 'buy' : isSell(input) ? 'sell' : null
}

export function isSell(input) {
    const sellRegex = /venda|vende|vender|vendalos/i
    const res = sellRegex.test(input)
    return res
}

export function isBuy(input) {
    const sellRegex = /compre|compra|comprando|comprelos/i
    const res = sellRegex.test(input)
    return res
}

