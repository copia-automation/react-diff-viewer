// scripts/build-worker.mjs
import { build } from 'esbuild'
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const result = await build({
  entryPoints: ['src/getLinesToRenderWorker.ts'],
  bundle: true,           // <-- pulls ALL deps into one file
  platform: 'browser',
  format: 'iife',         // or 'esm' if you want a module worker
  minify: true,
  write: false,
})

const code = result.outputFiles[0].text
const out = `export const getLinesToRenderWorkerCode = ${JSON.stringify(code)} as const;\n`
await fs.mkdir(path.join(__dirname, '../src/generated'), { recursive: true })
await fs.writeFile(path.join(__dirname, '../src/generated/workerCode.ts'), out)
