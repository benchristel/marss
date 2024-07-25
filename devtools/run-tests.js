#!/usr/bin/env bun
import {glob} from "glob"
import {join} from "path"
import {getAllTests, runTests, formatTestResultsAsText} from "@benchristel/taste"

const testPaths = join(__dirname, "../" + (process.argv[2] || "src/**/*.test.ts"))

glob(testPaths)
    .then((paths) => Promise.all(paths.map((path) => import(path))))
    .then(() => runTests(getAllTests()))
    .then(formatTestResultsAsText)
    .then(console.log)
    .catch(console.error)
