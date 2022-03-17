const assert = require('assert')
const { expect } = require('chai')

const { Params } = require('./params.js')

function add (agent, params) {
  params = new Params(params)
  const bodyString = params.string('bodyString')
  const organizationName = params.string('organization_name', agent.orgName)
  const user = params.string('user_name', agent.user)
  params.assertEmpty()

  const request = agent.post('/api/organization')

  if (bodyString) {
    request.type('json').send(bodyString)
  } else {
    assert(organizationName, 'Missing \'organization_name\' parameter.')
    assert(user, 'Missing \'user_name \' parameter.')
    request.send({ organization_name: organizationName, user_name: user })
  }

  return request
}

function del (agent, params) {
  params = new Params(params)
  const bodyString = params.string('bodyString')
  const organizationName = params.string('organization_name')
  params.assertEmpty()

  const request = agent.delete('/api/organization')

  if (bodyString) {
    request.type('json').send(bodyString)
  } else {
    assert(organizationName, 'Missing \'organization_name\' parameter.')
    request.send({ organization_name: organizationName })
  }

  return request
}

function verifyAddSuccess (r) {
  expect(r.status).to.equal(200)
  expect(r.body['api:status']).to.equal('api:success')
  expect(r.body['@type']).to.equal('api:AddOrganizationResponse')
  return r
}

function verifyDelSuccess (r) {
  expect(r.status).to.equal(200)
  expect(r.body['api:status']).to.equal('api:success')
  expect(r.body['@type']).to.equal('api:AddOrganizationResponse')
  return r
}

function verifyAddFailure (r) {
  expect(r.status).to.equal(400)
  expect(r.body['api:status']).to.equal('api:failure')
  expect(r.body['@type']).to.equal('api:AddOrganizationErrorResponse')
  return r
}

function verifyDelFailure (r) {
  expect(r.status).to.equal(400)
  expect(r.body['api:status']).to.equal('api:failure')
  expect(r.body['@type']).to.equal('api:DeleteOrganizationErrorResponse')
  return r
}

function verifyDelNotFound (r) {
  expect(r.status).to.equal(404)
  expect(r.body['api:status']).to.equal('api:not_found')
  expect(r.body['@type']).to.equal('api:DeleteOrganizationErrorResponse')
  return r
}

module.exports = {
  add,
  del,
  verifyAddSuccess,
  verifyAddFailure,
  verifyDelSuccess,
  verifyDelFailure,
  verifyDelNotFound,
}
