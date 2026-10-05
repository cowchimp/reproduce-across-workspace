const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
});
const db = client.db();
const todos = db.collection('todos');

module.exports = {
  ping: () => db.command({ ping: 1 }),
  list: async () => (await todos.find({}, { maxTimeMS: 10000 }).sort({ _id: 1 }).toArray())
    .map(({ _id, title, done }) => ({ id: _id.toHexString(), title, done })),
  add: title => todos.insertOne({ title, done: false }),
  remove: id => todos.deleteOne({ _id: new ObjectId(id) }),
  setDone: (id, done) => todos.updateOne({ _id: new ObjectId(id) }, { $set: { done } }),
  close: () => client.close(),
};
