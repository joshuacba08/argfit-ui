#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const versionPattern = /^v?(\d+)\.(\d+)\.(\d+)$/
const bumpActions = new Set(['major', 'minor', 'patch', 'current'])
const stageableVersionFiles = [
  'package.json',
  'pnpm-lock.yaml'
]

function run(command, args, options = {}) {
  const isWindows = process.platform === 'win32'
  const needsShell = isWindows && command === 'pnpm'
  const result = spawnSync(command, args, { stdio: 'inherit', cwd: repositoryRoot, shell: needsShell, ...options })
  if (result.error || result.status !== 0) {
    console.error(`Command failed: ${command} ${args.join(' ')}`)
    process.exit(1)
  }
}

function getPackageJson() {
  const pkgPath = resolve(repositoryRoot, 'package.json')
  return JSON.parse(readFileSync(pkgPath, 'utf8'))
}

function writePackageJson(data) {
  const pkgPath = resolve(repositoryRoot, 'package.json')
  writeFileSync(pkgPath, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

function bumpVersion(version, action) {
  if (action === 'current') return version

  const match = version.match(versionPattern)
  if (!match) {
    console.error(`Invalid version format: ${version}`)
    process.exit(1)
  }

  let major = parseInt(match[1], 10)
  let minor = parseInt(match[2], 10)
  let patch = parseInt(match[3], 10)

  if (action === 'major') {
    major++
    minor = 0
    patch = 0
  } else if (action === 'minor') {
    minor++
    patch = 0
  } else if (action === 'patch') {
    patch++
  }

  return `${major}.${minor}.${patch}`
}

function main() {
  const action = process.argv[2]
  if (!bumpActions.has(action)) {
    console.error(`Usage: node scripts/release.mjs <${Array.from(bumpActions).join('|')}>`)
    process.exit(1)
  }

  // 1. Run tests before release (quality check)
  console.log('Running tests...')
  run('pnpm', ['test:all'])

  const pkg = getPackageJson()
  const currentVersion = pkg.version
  const nextVersion = bumpVersion(currentVersion, action)

  if (currentVersion === nextVersion) {
    console.log(`Creating release for current version: v${currentVersion}`)
  } else {
    console.log(`Bumping version: v${currentVersion} -> v${nextVersion}`)
    
    // Update package.json
    pkg.version = nextVersion
    writePackageJson(pkg)

    // Update pnpm-lock.yaml if needed (pnpm install --lockfile-only)
    console.log('Updating pnpm-lock.yaml...')
    run('pnpm', ['install', '--lockfile-only'])
  }

  // Stage version files
  const filesToStage = stageableVersionFiles.filter(file => existsSync(resolve(repositoryRoot, file)))
  run('git', ['add', ...filesToStage])

  // Commit
  const commitMsg = `chore(release): v${nextVersion}`
  run('git', ['commit', '--no-verify', '-m', commitMsg])

  // Tag
  const tag = `v${nextVersion}`
  run('git', ['tag', tag])

  console.log(`\nSuccessfully released ${tag}.`)
  console.log(`To push the changes and tag, run:`)
  console.log(`  git push origin HEAD`)
  console.log(`  git push origin ${tag}`)
}

main()
