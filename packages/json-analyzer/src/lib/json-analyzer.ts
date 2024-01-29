import chalk from "chalk";
import fs from "fs"
import fastStringify from "fast-json-stable-stringify"
import fastJSONStringify from "fast-json-stringify"
import {Suite} from "benchmark"
import { program } from "commander";
import { version } from "../../package.json" assert { type: "json" };
import protobufjs from "protobufjs"

program
  .name("Json Analyser")
  .description("Benchmark helper to choose which JSON serializer is good for your payload")
  .version(version);


program
  .command("bench")
  .description('Bench a JSON file and return the best serialization library')
  .argument('<jsonFilePath>', 'the JSON file path')
  .option('--jsonSchema <string>', 'jsonSchema file path')
  .option('--proto <string>', 'proto file path')
  .option('--protoMessage <string>', 'proto Message to use')
  .action((filename, opts) => {
    const file = fs.readFileSync(filename).toString()
    let jsonSchema = {};
    if(opts.jsonSchema) {
      jsonSchema = JSON.parse(fs.readFileSync(opts.jsonSchema).toString() || "{}")
    }

    const parser = fastJSONStringify(jsonSchema)
    const json = JSON.parse(file)
    const suite = new Suite()

    if(opts.proto && opts.protoMessage) {
      const proto = protobufjs.loadSync(opts.proto).root.lookupType(opts.protoMessage);
      suite.add('Protobuf', function() {
        const encodedMessage = proto.create(json);
        proto.encode(encodedMessage).finish()
      })
    }


    suite.add('JSON.stringify', function() {
      Buffer.from(JSON.stringify(json))
    })
    .add('fast-json-stable-stringify', function() {
      Buffer.from(fastStringify(json))
    })
    .add('fast-json-stringify', function() {
      Buffer.from(parser(json))
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
  })

program.parse();
