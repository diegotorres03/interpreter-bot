

import { assign, createMachine, interpret, Interpreter, Machine, MachineConfig } from 'xstate'

import { BotPhrasesJSON } from './bot-phrases.list'

import axios from 'axios'
import { pick } from './utils'

export interface UserMessage {
    text: string
    tags?: string[]
    id?: string
    userId?: string
}

export interface InterpreterContextJSON {
    registeredBots: BotPhrasesJSON[]
    counters: {
        handlerCount: number
        botCount: number
        langCount: number
        regexCount: number
    }
    currentBot: BotPhrasesJSON
    selectedHandler: BotPhrasesJSON
    possibleHandlers: Array<BotPhrasesJSON>
    messages: Array<any>
    latestMessage: any
    response: any
}

// @ts-ignore
console.json = (data) => console.log(JSON.stringify(data, undefined, 2))

const machineDef: MachineConfig<InterpreterContextJSON, any, any> = {
    id: 'interpreter-machine-v1',
    initial: 'idle',
    context: {
        registeredBots: [],
        counters: { botCount: 0, handlerCount: 0, langCount: 0, regexCount: 0, },
        latestMessage: '',
        messages: [],
        response: '',
        currentBot: null,
        selectedHandler: null,
        possibleHandlers: [],
    },
    states: {
        idle: {
            on: {
                message: { target: 'findingHandlers', actions: ['saveMessage', 'resetHandlers'] },
                registerBot: { target: 'idle', actions: 'saveBot' },
            },
        },

        // loop trough bots to find suitable handler
        findingHandlers: {
            invoke: {
                src: 'wait',
                onDone: { target: 'searchOnBot', actions: 'resetBotCount' },
                onError: 'error'
            }
        },
        searchOnBot: {
            invoke: {
                src: 'wait',
                onDone: { target: 'searchByLang', actions: 'resetLangCount' },
                onError: 'error'
            }
        },
        searchByLang: {
            invoke: {
                src: 'wait',
                onDone: { target: 'matchRegex', actions: 'resetRegexCount' },
                onError: 'error'
            }
        },
        matchRegex: {
            invoke: {
                src: 'matchRegex',
                onDone: [
                    { target: 'handlerFound', actions: 'setCurrentBot', cond: 'handlerFound' },
                    { target: 'matchRegex', actions: 'incrementRegexCount', cond: 'regexAvaiable' },
                    { target: 'searchByLang', actions: 'incrementLangCount', cond: 'langAvailable' },
                    { target: 'searchOnBot', actions: 'incrementBotCount', cond: 'botAvailable' },
                    { target: 'noHandler', actions: 'incrementRegexCount', },
                ],
                onError: 'error'
            }
        },
        handlerFound: {
            invoke: {
                src: 'wait',
                onDone: [{ target: 'selectHandler', actions: 'addHandler' }],
                onError: 'error'
            }
        },
        noHandler: {},
        selectHandler: {
            // clarification to user may be nedeed here
            invoke: {
                src: 'selectHandler',
                onDone: { target: 'executeHandler', actions: 'setSelectedHandler' },
                onError: 'error'
            }
        },
        executeHandler: {
            invoke: {
                src: 'callHandler',
                onDone: { target: 'sendResponse', actions: 'saveResponse' },
                onError: 'error'
            }
        },
        sendResponse: {
            invoke: {
                src: 'wait',
                onDone: { target: 'idle' },
                onError: 'error'
            }
        },
        error: {
            always: 'idle'
        },

    }
}

export const BotChainFactory = createMachine<InterpreterContextJSON>(machineDef, {
    actions: {
        saveMessage: assign({
            latestMessage: (ctx, event) => event.data,
            messages: (ctx, event) => ([...ctx.messages, event.data])
        }),
        saveResponse: assign({ response: (ctx, event) => event.data }),
        setSelectedHandler: assign({ selectedHandler: (ctx, event) => ({ botName: event.data.botName, botUrl: event.data.botUrl }) }),
        setCurrentBot: assign({ currentBot: (ctx, event) => ctx.registeredBots[ctx.counters.botCount], }),
        addHandler: assign({
            possibleHandlers: (ctx, event) => ([...ctx.possibleHandlers, ctx.currentBot]),
        }),
        saveBot: assign({ registeredBots: (ctx, event) => [...ctx.registeredBots, event.data] }),

        resetCounters: assign({ counters: (ctx, event) => ({ botCount: 0, handlerCount: 0, langCount: 0, regexCount: 0 }) }),
        resetBotCount: assign({ counters: (ctx, event) => ({ ...ctx.counters, ...{ botCount: 0 } }) }),
        resetHandlers: assign({ counters: (ctx, event) => ({ ...ctx.counters, ...{ handlerCount: 0 } }) }),
        resetLangCount: assign({ counters: (ctx, event) => ({ ...ctx.counters, ...{ langCount: 0 } }) }),
        resetRegexCount: assign({ counters: (ctx, event) => ({ ...ctx.counters, ...{ regexCount: 0 } }) }),

        incrementRegexCount: assign({ counters: (ctx, event) => ({ ...ctx.counters, ...{ regexCount: ctx.counters.regexCount + 1 } }) }),
        incrementLangCount: assign({ counters: (ctx, event) => ({ ...ctx.counters, ...{ langCount: ctx.counters.langCount + 1 } }) }),
        incrementBotCount: assign({ counters: (ctx, event) => ({ ...ctx.counters, ...{ botCount: ctx.counters.botCount + 1 } }) }),
    },


    guards: {
        regexAvaiable: (ctx, event) => {
            const { botCount, langCount, regexCount } = ctx.counters
            const currentBot = ctx.registeredBots[botCount]
            const currentLang = Object.keys(currentBot.regex)[langCount]
            return regexCount < currentBot.regex[currentLang].length - 1
        },
        langAvailable: (ctx, event) => {
            const { botCount, langCount } = ctx.counters
            const currentBot = ctx.registeredBots[botCount]
            return langCount < Object.keys(currentBot.regex).length - 1
        },
        botAvailable: (ctx, event) => {
            const { botCount } = ctx.counters
            return botCount < ctx.registeredBots.length - 1
        },

        handlerFound: (ctx, event) => event.data,
    },

    services: {
        wait: (ctx, event) => new Promise(resolve => setTimeout(resolve,3)),

        matchRegex: async (ctx, event) => {
            const { botCount, langCount, regexCount } = ctx.counters
            const currentBot = ctx.registeredBots[botCount]
            const currentLang = Object.keys(currentBot.regex)[langCount]
            if (currentBot.regex[currentLang].length === 0) {
                return false
            }

            const currentRegex = new RegExp(currentBot.regex[currentLang][regexCount], 'i')
            return currentRegex.test(ctx.latestMessage)
        },

        selectHandler: async(ctx, event) => {
            if(ctx.possibleHandlers.length < 1) throw new Error('no handler found') 
            if(ctx.possibleHandlers.length === 1) return ctx.possibleHandlers[0]
            return pick(ctx.possibleHandlers)
        },

        callHandler: async (ctx, event) => {
            console.log('selectedHandler', ctx.selectedHandler)
            // const url = ctx.selectedHandler.botUrl
            // const res = (await axios.post('url'))
        },
    },
})

export function createInstance(
    context?: InterpreterContextJSON
): { botId: string, bot: Interpreter<InterpreterContextJSON, any, any> } {
    const bot = interpret(BotChainFactory)
    bot.start()
    const botId = bot.id
    return { botId, bot }
}

export function run(registeredBots?: BotPhrasesJSON[]) {
    const { bot, botId } = createInstance()
    console.log('-------------------------')
    bot.onTransition(state => {
        console.log(state.value)
        // console.table(state.context)
        // @ts-ignore
        // console.json(state.context.selectedHandler)
    })

    if (Array.isArray(registeredBots)) {
        registeredBots.forEach(botToRegister => {
            bot.send('registerBot', { data: botToRegister })
        })
    }

    // bot.send('message', { data: 'asdasdasd' })
    bot.send('message', { data: 'compre crypto' })
    // bot.send('message', { data: 'que puedo hacer' }) // este si esta

}

