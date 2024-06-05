import { program } from "commander";
import { readFileSync, writeFileSync } from "fs";
import Benchmark from "benchmark";
import { markedBench } from "./marked.js";
import chalk from "chalk";
import { prepareRemarkBench } from "./remark.js";


const { Suite } = Benchmark

program
  .name("Markdown to Html Analyser")
  .description("Benchmark helper to choose which Markdown to HTML lib is good for your payload")
  .version("0.0.1");

  program
  .command("bench")
  .description('Bench a MD file and return the best serialization library')
  .argument('<mdFilePath>', 'the JSON file path')
  .action(async (filename, opts) => {
    const file = readFileSync(filename).toString();

    const suite = new Suite({
      maxTime: 30
    })

    const remarkBench = await prepareRemarkBench()

    const resultMarked = markedBench(file);
    const resultRemark = (await remarkBench(file)).value

    writeFileSync("resultMarked.html", resultMarked)
    writeFileSync("resultRemark.html", resultRemark)

    suite.add('Marked-DomPurify', function() {
      markedBench(file)
    })
    .add('Remark-Rehype', async function() {
      await remarkBench(file)
    })
    // add listeners
      //@ts-ignore
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      //@ts-ignore
      console.log('Fastest library for your case is ✨ ' + chalk.bgGreenBright.white(this.filter('fastest').map('name')) + ' ✨');
      console.log('You can compare the results in the files ' + chalk.bgBlueBright.white('resultMarked.html') + ' and ' + chalk.bgBlueBright.white('resultRemark.html') + ' ✨');
    })
    // run async
    .run({ 'async': true });
  })

program.parse();
