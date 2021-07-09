import { run } from './src/interpreter.def'
// import { run } from './src/interpreter'
import { registeredBotPhrases } from './src/bot-phrases.list'


console.log(registeredBotPhrases)

run(registeredBotPhrases)

