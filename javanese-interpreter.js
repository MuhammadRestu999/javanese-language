#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

let fileLocate = null
const parseArgs = () => {
  const args = process.argv;
  if(args.length < 3) {
    console.log("Require file args, ex: \"node javanese-interpreter.js example/example1.javanese\" or \"javanese example/example1.javanese\"");
    return false;
  }

  fileLocate = args[2];
  if(!fs.existsSync(fileLocate)) {
    console.log(`File "${args[2]}" not found, please verify file location`)
    return false;
  }
  if(!(fs.statSync(fileLocate)).isFile()) {
    console.log(`${path.basename(fileLocate)} is not a file`);
    return false;
  }

  let ext = path.extname(fileLocate);
  if(ext != ".javanese") {
    console.log(`File extension is not supported, this script only supports \".javanese\" extension\n\nThe ${path.basename(fileLocate)} file extension is: ${ext}`);
    return false;
  }

  return true;
}

if(!parseArgs()) {
  process.exit(1)
}

const inputJavanese = fs.readFileSync(fileLocate, "utf-8")

function flexing(input) {
  let cmds = []
  const cmdLines = input.split("\n").filter(v => !!v)
  cmds = getCmd(cmdLines)
  return cmds;
}

function getCmd(cmdLines) {
  let parser = [
    breakFn,
    varAssign,
    varReassign,
    consoleLog,
    conditionIf,
    conditionElIf,
    conditionElse,
    loopFor,
    functionDeclarationBegin,
    runFunction,
    throwError,
    tryFn,
    catchFn,
    finallyFn,
  ]

  return cmdLines.map((line) => {
    let cmd = null
    for (const parse of parser) {
      cmd = parse(line)
      if(cmd) break;
    }

    return cmd
  }).filter((v) => !!v)
}

let mapCompare = {
  "padha karo": "==",
  "ndhuwur": ">",
  "ngisor": "<",
  "luwih gedhe utawa padha karo": ">=",
  "kurang saka utawa padha karo": "<="
}

const breakFn = (msg) => {
  let format = /rampung/
  let match = msg.match(format)
  if(!match) return null

  return {
    exp: "}"
  }
}

const varAssign = (msg) => {
  let format = /nyetel ([a-zA-Z0-9]+) iku ([^\[\]\(\)\n]+)/
  let match = msg.match(format)
  if(!match) return null;

  return {
    exp: `let ${match[1]} = ${valueTransform(match[2])};`
  }
}

const varReassign = (msg) => {
  let format = /ganti ([a-zA-Z0-9]+) dadi ([^\[\]\(\)\n]+)/
  let match = msg.match(format)
  if(!match) return null;

  return {
    exp: `${match[1]} = ${valueTransform(match[2])};`
  }
}

const valueTransform = (msg) => {
  let transforms = [
    booleanValue,
  ]

  for (const transform of transforms) {
    let res = transform(msg)
    if(res) {
      return res
    }
  }
  // if not transformed
  return msg;
}

const booleanValue = (msg) => {
  if(msg.match(/nggih$/)) {
    return "true"
  }
  if(msg.match(/ora$/)) {
    return "false"
  }
  return null
}

const consoleLog = (msg) => {
  let format = /nuduhake teks (.*)/
  let match = msg.match(format)
  if(!match) return null;

  return {
    exp: `console.log(${match[1]});`
  }
}

const conditionIf = (msg) => {
  let format = /yen\(([a-zA-Z0-9]+) ([a-zA-Z ]+) ([^\[\]\(\)\n]+)/
  let match = msg.match(format)
  if(!match) return null;
  if(match[2]) {
    match[2] = mapCompare[match[2]]
  }

  return {
    exp: `if(${match[1]} ${match[2]} ${valueTransform(match[3])})`,
    openGroup: true,
  }
}

const conditionElIf = (msg) => {
  let format = /utawa\(([a-zA-Z0-9]+) ([a-zA-Z ]+) ([^\[\]\(\)\n]+)/
  let match = msg.match(format)
  if(!match) return null;
  if(match[2]) {
    match[2] = mapCompare[match[2]]
  }

  return {
    exp: `else if(${match[1]} ${match[2]} ${valueTransform(match[3])})`,
    openGroup: true,
    closeGroup: true
  }
}

const conditionElse = (msg) => {
  let format = /yen ora/
  let match = msg.match(format)
  if(!match) return null;

  return {
    exp: "else",
    openGroup: true,
    closeGroup: true
  }
}

const loopFor = (msg) => {
  let format = /baleni\(([a-zA-Z0-9]+) saka ([a-zA-Z0-9]+) nganti ([a-zA-Z0-9]+)\)/
  let match = msg.match(format)
  if(!match) return null;

  return {
    exp: `for(let ${match[1]} = ${match[2]}; ${match[1]} <= ${match[3]}; ${match[1]}++)`,
    openGroup: true
  }
}

/**
 * @param msg {string}
 * note: function name must be alphabet followed by optional alphanumeric [a-zA-Z0-9] or underscore (_)
 */
 const functionDeclarationBegin = (msg) => {
  let format = /fungsi (\w+)\(((\w((, )?)+)*)\)?/
  let match = msg.match(format);
  if(!match) return null;

  const [,funcName, paramNames] = match
  const params = paramNames?.trim().split(/\s+/) ?? []

  return {
    exp: `function ${funcName}(${paramNames})`,
    openGroup: true
  }
}

const runFunction = (msg) => {
  let format = /mbukak (\w+)( args [A-z0-9 "'1\(\)\[\]\{\}\.\?\!\$\,]+)?/
  let match = msg.match(format)
  if(!match) return null

  let args = msg.includes(" args ") ? match[2].replace(" args ", "").trim().split(/\s+/) : undefined
  return {
    exp: `${match[1]}(${args.join(", ") ?? ""})`
  }
}

const throwError = (msg) => {
  const format = /uncal (.*)/
  const match = msg.match(format)
  if(!match) return null;

  return {
    exp: `throw new Error(${match[1]});`
  }
}

const tryFn = (msg) => {
  let format = /coba/
  let match = msg.match(format)
  if(!match) return null;

  return {
    exp: "try",
    openGroup: true,
  }
}

const catchFn = (msg) => {
  let format = /nyekel/
  let match = msg.match(format)
  if(!match) return null;

  return {
    exp: "catch",
    openGroup: true,
    closeGroup: true
  }
}

const finallyFn = (msg) => {
  let format = /pungkasanipun/
  let match = msg.match(format)
  if(!match) return null;

  return {
    exp: "finally",
    openGroup: true,
    closeGroup: true,
  }
}

const execCmd = (cmds) => {
  //console.log(cmds)
  let resultCmds = "";

  let isOpenGroup = false
  for (const cmd of cmds) {
    //console.log(cmd)
    let tempRes = cmd.exp
    if(cmd.closeGroup) {
      tempRes = "} " + tempRes
      isOpenGroup = false
    }
    if(cmd.openGroup) {
      tempRes = tempRes + " {"
      isOpenGroup = true
    }
    resultCmds += tempRes + "\n"
  }
  /*if(isOpenGroup) {
    resultCmds += " }"
  }*/

  eval(resultCmds)
}

const result = flexing(inputJavanese)
execCmd(result)
