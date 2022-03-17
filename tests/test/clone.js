const fs = require('fs/promises')
const exec = require('util').promisify(require('child_process').exec)
const { expect } = require('chai')
const { Agent, db, endpoint, util } = require('../lib')

let agent

describe('clone', function () {
  before(async function () {
    agent = new Agent().auth()
    await exec('./terminusdb.sh store init --force')
  })

  after(async function () {
    await fs.rm('storage', { recursive: true })
  })

  it('fails with socket error', async function () {
    const first = './terminusdb.sh clone --user=' + util.randomString() +
      ' --password=' + util.randomString()
    const lasts = [
      ' http://localhost:65535/' + util.randomString(), // Connection refused
      ' http://' + util.randomString() + ':65535/' + util.randomString(), // nodename nor servname provided
    ]
    // We run this at least twice to make sure that the error is the same.
    // Previously, the database would be created during the first run, and the
    // second run had a different error.
    for (const last of lasts) {
      const r = await exec(first + last).catch((result) => {
        expect(result.code).to.not.equal(0)
        expect(result.stdout).to.equal('')
        console.error('result.stderr:', result.stderr)
        expect(result.stderr).to.match(/^Error: HTTP request failed with socket error/)
        return true
      })
      expect(r).to.be.true
    }
  })

  it('succeeds', async function () {
    const defaults = agent.defaults()
    const { path } = endpoint.db(defaults)
    // Create a database
    await db.create(agent, path).then(db.verifyCreateSuccess)
    // Clone the database
    const dbSpec = defaults.orgName + '/' + defaults.dbName
    const url = defaults.baseUrl + '/' + dbSpec
    const r = await exec(
      './terminusdb.sh clone --user=' + defaults.userName +
      ' --password=' + defaults.password +
      ' ' + url,
    )
    expect(r.stdout).to.match(new RegExp('Cloned: \'' + url + '\' into ' + dbSpec))
    // Delete the database
    await db.del(agent, path).then(db.verifyDeleteSuccess)
  })
})
