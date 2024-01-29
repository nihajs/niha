# json-analyzer

A simple library to determine which stringify library is faster:

- JSON.stringify
- [fast-json-stable-stringify](https://www.npmjs.com/package/fast-json-stable-stringify)
- [fast-json-stringify](https://www.npmjs.com/package/fast-json-stringify)
- [protobufjs](https://www.npmjs.com/package/protobufjs)
## Usage

Run `npx @niha-js/json-analyzer bench jsonFile.json --jsonSchema jsonSchemaFile.json --proto file.proto --protoMessage ProtoMessage`

> Please note: jsonSchemaFile.json is optional but recommended to get get better results for fast-json-stringify

## Help

```
Usage: Json Analyser [options] [command]

Benchmark helper to choose which JSON serializer is good for your payload

Options:
  -V, --version                   output the version number
  -h, --help                      display help for command

Commands:
  bench [options] <jsonFilePath>  Bench a JSON file and return the best serialization library
  help [command]                  display help for command
```
