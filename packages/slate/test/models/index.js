
import assert from 'assert'
import fs from 'fs'
import { Schema } from '../..'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('models', () => {
  describe('change', () => {
    describe('withMutations', () => {
      const testsDir = resolve(__dirname, 'change')
      const tests = fs.readdirSync(testsDir).filter(t => t[0] != '.').map(t => basename(t, extname(t)))

      for (const test of tests) {
        it(test, async () => {
          const module = require(resolve(testsDir, test))
          const { input, output, schema, normalize, customChange } = module
          const s = Schema.create(schema)
          const expected = output
          const flags = normalize !== undefined ? { normalize } : {}
          const change = input
            .change(flags)
            .setValue({ schema: s })
          const actual = change.withMutations(customChange)
            .value.toJSON()

          assert.deepEqual(actual, expected)
          assert.deepEqual(change.flags.normalize, normalize)
        })
      }
    })
  })
})
