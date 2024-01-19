import chalk from "chalk";
import fs from "fs"
import fastStringify from "fast-json-stable-stringify"
import fastJSONStringify from "fast-json-stringify"
import {Suite} from "benchmark"

const [filename, jsonSchemaFileName] = process.argv.splice(2);

if(!filename) {
  console.log(`${chalk.bgRed.white("Error")} ${chalk.red("No file provided")}`)
  console.log(`${chalk.bgBlack.white("Example usage :")}`)
  console.log(`${chalk.bgBlack.white("npx @niha-js/json-analyzer path/to/json/file.json")}`)
}

const file = fs.readFileSync(filename).toString()
let jsonSchema = {};
if(jsonSchemaFileName) {
  jsonSchema = JSON.parse(fs.readFileSync(jsonSchemaFileName).toString() || "{}")
}
const parser = fastJSONStringify(jsonSchema)

// console.time(`JSON.parse`)
const json = JSON.parse(file)
// console.timeEnd(`JSON.parse`)

const suite = new Suite()

suite.add('JSON.stringify', function() {
  JSON.stringify(json)
})
.add('fast-json-stable-stringify', function() {
  fastStringify(json)
})
.add('fast-json-stringify', function() {
  parser(json)
})
// add listeners
  //@ts-ignore
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  //@ts-ignore
  console.log('Fastest library for your case is ✨ ' + chalk.bgGreenBright.white(this.filter('fastest').map('name')) + ' ✨');
})
// run async
.run({ 'async': true });
