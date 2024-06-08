import { Types, Model, Document } from "mongoose";

import UserModel from "@/src/models/user.model";
import RequestModel from "@/src/models/request.model";
import LoanModel from "@/src/models/loan.model";
import connectDB from "@/src/connection";
import { DATABASE_NAME } from "@/lib/config";
import {
  LoanCreateDTO,
  RawRequestCreateDTO,
  RequestCreateDTO,
  UserCreateDTO,
  UserDoc,
} from "@/types";

// arrays for collecting seeded documents
const gbSeededRequests: Types.ObjectId[] = [];
const dvSeededRequests: Types.ObjectId[] = [];
const gbSeededLoans: Types.ObjectId[] = [];
const seededUsers: Types.ObjectId[] = [];

// ensure seeding a model multiple timesin this
// session does not remove previously seeded data in the model.
/*
const seedCount: any = new Map([
  [UserModel, 0],
  [RequestModel, 0],
  [LoanModel, 0],
]);
*/
const seedCount = new Map();
seedCount.set(UserModel, 0);
seedCount.set(RequestModel, 0);
seedCount.set(LoanModel, 0);

const dummyObjectId = new Types.ObjectId();
const now = new Date();
const dueDate = new Date(now.setMonth(now.getMonth() + 12));
const db = DATABASE_NAME;

// prepare raw seed data
const userData: UserCreateDTO[] = [
  {
    firstName: 'Greenbel',
    lastName: 'Eleghasim',
    email: 'obisann@gmail.com',
    password: 'greenbelpwd',
  },
  {
    firstName: 'David',
    lastName: 'Eleghasim',
    email: 'david@gmail.com',
    password: 'davidpwd',
  },
];

const gbRequestDataNoUser: RequestCreateDTO[] = [
  {
    amountRequested: 100000,
    amountRepayable: 110000,
    tenure: 12,
    userId: dummyObjectId, // ! add userId prop before saving
  },
  {
    amountRequested: 200000,
    amountRepayable: 220000,
    tenure: 12,
    userId: dummyObjectId, // ! add userId prop before saving
  },
];

const dvRequestDataNoUser: RequestCreateDTO[] = [
  {
    amountRequested: 500000,
    amountRepayable: 550000,
    tenure: 12,
    userId: dummyObjectId, // ! add userId prop before saving
  },
];

const gbLoanNoRequest: LoanCreateDTO[] = [
  {
    dueDate,
    requestId: dummyObjectId, // ! replace with actual req ID
  },
];

/**
 * Handles the logic for seeding a couple of related collections.
 * 
 * At the moment, there are three collections whose seeding is being handled here:
 *  - users
 *  - requests
 *  - loans
 * 
 * The high-level view of the algorithm is as follows:
 *  - establish database connection
 *  - prepare seed documents, using logic to account for the relationships
 *  - use the `seed` function to seed each collection
 */
async function seeder() {
  // connect to db
  // await mongoose.connect(mongoURI);
  await connectDB(db);

  // seed users
  await seed(UserModel, { docs: userData, isModelled: false }, seededUsers);

  // seed gb requests
  const gbReqData: RequestCreateDTO[] = gbRequestDataNoUser.map((reqObj) => {
    // return reqs with [gb] user id attached, before saving
    return {
      ...reqObj,
      userId: seededUsers[0],
    };
  });

  // seed dv requests
  const dvReqData: RequestCreateDTO[] = dvRequestDataNoUser.map((reqObj) => {
    // return reqs with [dv] user id attached, before saving
    return {
      ...reqObj,
      userId: seededUsers[1],
    };
  });

  await seed(RequestModel, { docs: gbReqData, isModelled: false }, gbSeededRequests);
  await seed(RequestModel, { docs: dvReqData, isModelled: false }, dvSeededRequests);

  // seed gb loans
  const gbLoanData: LoanCreateDTO[] = gbLoanNoRequest.map((loanObj) => {
    // return loans with [gb] req id attached, before saving
    return {
      ...loanObj,
      requestId: gbSeededRequests[0],
    };
  });

  await seed(LoanModel, { docs: gbLoanData, isModelled: false }, gbSeededLoans);
}

type SeedDoc = {
  docs: RequestCreateDTO[] | UserCreateDTO[] | LoanCreateDTO[] | Document[];
  isModelled: boolean;
};

// TODO: put `seed` function in utils, maybe?

/**
 * Handles seeding an individual collection.
 * @params {mongoose.Model} Model - mongoose model representing the collection to seed.
 * @params {Object[]} docs - documents to seed the database with.
 * @params {Object[]} seedCollector - the array to push seeded docs into.
 */
async function seed(
  Model: (typeof UserModel | typeof RequestModel | typeof LoanModel)
  & { deleteMany(arg0: any): any },
  docsData: SeedDoc,
  seedCollector: Types.ObjectId[]
) {
  if (seedCount.get(Model) === 0) {
    // drop old data
    await Model.deleteMany({});
    seedCount.set(Model, 1);
  }

  // array of docs to be saved
  const toSave: Document[] = [];

  const isDocument = function (obj: unknown): obj is Document {
    return docsData.isModelled;
  };

  const docs = docsData.docs;
  if (!isDocument(docs[0])) {
    for (const doc of docs) {
      // create and save new document
      const newDoc = new Model(doc);
      toSave.push(newDoc);
    }
  } else {
    // docs are already modelled by calling `new Model(doc)`
    toSave.push(...docs as Document[]);
  }

  // execute save op and return seeded docs to collector
  console.log(`seeding ${Model.modelName}...`);
  const bulkResult = await Model.bulkSave(toSave);
  seedCollector.push(...(Object.values(bulkResult.insertedIds)));
  console.log(`seeded ${Model.modelName}\n`);
}

seeder()
  .then(() => {
    console.log('seeding complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
