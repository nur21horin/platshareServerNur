// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gikxdnx.mongodb.net/?appName=Cluster0`;

// let client;
// let connectPromise;
// let collections;

// function getClient() {
//   if (!client) {
//     client = new MongoClient(uri, {
//       serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//       },
//     });
//   }

//   return client;
// }

// async function ensureDbConnection() {
//   if (!connectPromise) {
//     connectPromise = getClient()
//       .connect()
//       .then((connectedClient) => {
//         collections = buildCollections(connectedClient);
//         return connectedClient;
//       });
//   }

//   await connectPromise;
//   return client;
// }

// function buildCollections(connectedClient) {
//   const db = connectedClient.db("foodDB");

//   return {
//     foods: db.collection("foods"),
//     requests: db.collection("requests"),
//     users:db.collection("users")
//   };
// }

// async function getCollections() {
//   if (!collections) {
//     await ensureDbConnection();
//   }

//   return collections;
// }

// module.exports = {
//   ensureDbConnection,
//   getCollections,
//   ObjectId,
// };


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gikxdnx.mongodb.net/?appName=Cluster0`;

let client;
let clientPromise;
let collections;

// Function to create MongoClient if it doesn't exist
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

// Ensure connection is established (reuse across serverless invocations)
async function ensureDbConnection() {
  if (!clientPromise) {
    clientPromise = getClient()
      .connect()
      .then((connectedClient) => {
        collections = buildCollections(connectedClient);
        return connectedClient;
      });
  }
  await clientPromise;
  return client;
}

// Build collections object for easier access
function buildCollections(connectedClient) {
  const db = connectedClient.db("foodDB");
  return {
    foods: db.collection("foods"),
    requests: db.collection("requests"),
    users: db.collection("users"),
  };
}

// Return collections safely
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
