const { Agent, db, document, endpoint } = require('../lib')

const agent = new Agent().auth()
const defaults = agent.defaults()

module.exports = (schema, instance) => {
  let request
  let response
  return {
    beforeEach: async () => {
      // Create the database.
      await db.create(agent, endpoint.db(defaults).path).then(db.verifyCreateSuccess)
      // Insert the schema.
      await document
        .insert(agent, endpoint.document(defaults).path, { schema })
        .then(document.verifyInsertSuccess)
      // Construct the request.
      request = document.insert(agent, endpoint.document(defaults).path, { instance })
    },

    afterEach: async () => {
      // Delete the database.
      await db.del(agent, endpoint.db(defaults).path).then(db.verifyDeleteSuccess)
      // Verify the response.
      document.verifyInsertSuccess(response)
    },

    fn: async () => {
      // Send the request and get the response.
      response = await request
    },
  }
}