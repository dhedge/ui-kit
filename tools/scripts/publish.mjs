/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */

import { execSync } from 'child_process'

import devkit from '@nx/devkit'
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
const { readCachedProjectGraph } = devkit

function invariant(condition, message) {
  if (!condition) {
    console.error(message)
    process.exit(1)
  }
}

// Executing publish script: node path/to/publish.mjs {name}
const [, , name] = process.argv

const graph = readCachedProjectGraph()
const project = graph.nodes[name]

invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`,
)

const outputPath = project.data?.targets?.build?.options?.outputPath
invariant(
  outputPath,
  `Could not find "build.options.outputPath" of project "${name}". Is project.json configured  correctly?`,
)

// const readmePath = outputPath.split('/').slice(0, -1).join('/') + '/README.md' // in case README.md will be in project folder
const readmePath = 'README.md'

if (existsSync(readmePath)) {
  try {
    copyFileSync(readmePath, `${outputPath}/README.md`)
  } catch (error) {
    console.error('Error copying README.md:', error)
  }
}

// Path to the root and library package.json files
const rootPkgPath = 'package.json'
const libPkgPath = `${outputPath}/package.json`

// Merge dependencies from root package.json into the library's package.json
if (existsSync(rootPkgPath) && existsSync(libPkgPath)) {
  try {
    const rootPkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'))
    const libPkg = JSON.parse(readFileSync(libPkgPath, 'utf8'))

    // Merge dependencies, devDependencies, and peerDependencies
    libPkg.dependencies = rootPkg.dependencies
    // Write back to the library's package.json
    writeFileSync(libPkgPath, JSON.stringify(libPkg, null, 2))
  } catch (error) {
    console.error('Error writing package.json dependencies:', error)
  }
}

process.chdir(outputPath)

// Execute "npm publish" to publish
execSync(`npm publish --access public`)
