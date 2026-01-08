const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gikxdnx.mongodb.net/?appName=Cluster0`;

let client;
let connectPromise;
let collections;

function getClient() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  return client;
}

async function ensureDbConnection() {
  if (!connectPromise) {
    connectPromise = getClient()
      .connect()
      .then((connectedClient) => {
        collections = buildCollections(connectedClient);
        return connectedClient;
      });
  }

  await connectPromise;
  return client;
}

function buildCollections(connectedClient) {
  const db = connectedClient.db("foodDB");

  return {
    foods: db.collection("foods"),
    requests: db.collection("requests"),
    users:db.collection("users")
  };
}

async function getCollections() {
  if (!collections) {
    await ensureDbConnection();
  }

  return collections;
}

module.exports = {
  ensureDbConnection,
  getCollections,
  ObjectId,
};

