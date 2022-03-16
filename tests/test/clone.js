const exec = require('util').promisify(require('child_process').exec)
const { expect } = require('chai')
// const { util } = require('../lib')

describe('clone', function () {
  before(async function () {
    await exec('./terminusdb.sh store init --force')
  })

  after(async function () {
    await exec('rm -rf storage/*')
  })

  it('fails with socket error', async function () {
    const cmd = exec('./terminusdb.sh clone --user=admin --password=root http://localhost:12345/admin/db')
    // We run this twice to make sure that the error is the same. Previously,
    // the database would be created during the first run, and the second run
    // had a different error.
    for (let i = 0; i < 2; i++) {
      const r = await cmd.catch((result) => {
        expect(result.code).to.not.equal(0)
        expect(result.stdout).to.equal('')
        expect(result.stderr).to.match(/^Error: HTTP request failed with socket error: Connection refused/)
        return true
      })
      expect(r).to.be.true
    }
  })
})
