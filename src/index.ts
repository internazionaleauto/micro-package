import { execSync } from 'child_process';
import mongoose, { Model } from 'mongoose';
import { ContactSchema } from './../schema';
import { readFileSync, existsSync } from 'fs';
import { CertOptions, HocDocument, SSLData } from '../inft';

export const getOrCreateSSHCertificate = ({
  PATH, PASS_PHASES, ORGANIZATION_NAME, UNITE_NAME, COMPANY_LOCALITY, COMPANY_STATE, COUNTRY_TWO_LATTER, SSL_DOMAIN, COMPANY_EMAIL
}: SSLData): { options: CertOptions } => {

  // console.log("PATH", PATH);
  // console.log("__dirname", __dirname);

  // const certFolder = `${process.cwd()}/${PATH}`;

  // console.log("certFolder", PATH);

  // const { PATH, PASS_PHASES } = data;

  if (!existsSync(PATH)) {
    execSync(`mkdir ${PATH}`);
  };

  // console.log("keys", keys);

  const options: CertOptions = {
    key: '',
    cert: '',
    passphrase: ''
  };

  const privateKeyPath = `${PATH}/private_key.pem`;
  const certificatePath = `${PATH}/certificate.pem`;

  // const { PASS_PHASES, WHER_COMPANY, COMPANY_STATE, COMPANY_LOCAL_NAME, COMPANY_ORGANIZATION, COMPANY_UNITE, SERVER_URI, COMPANY_EMAIL } = keys;

  // Check certificate is exist or not
  if (!existsSync(privateKeyPath) || !existsSync(certificatePath)) {

    const { key, cert } = generateCertificate({
      privateKeyPath, certificatePath, PATH, PASS_PHASES, ORGANIZATION_NAME, UNITE_NAME, COMPANY_LOCALITY, COMPANY_STATE, COUNTRY_TWO_LATTER, SSL_DOMAIN, COMPANY_EMAIL
    });

    options['key'] = key;
    options['cert'] = cert;
    options['passphrase'] = PASS_PHASES!;

    return {
      options
    };

  } else {

    // Read the private key and certificate files
    const privateKey = readFileSync(privateKeyPath);
    const certificate = readFileSync(certificatePath);

    options['key'] = privateKey;
    options['cert'] = certificate;
    options['passphrase'] = PASS_PHASES!;

    return {
      options
    };

  }
};


// Generate a self-signed SSL certificate and key
const generateCertificate = ({
  privateKeyPath, certificatePath, PASS_PHASES, ORGANIZATION_NAME, UNITE_NAME, COMPANY_LOCALITY, COMPANY_STATE, COUNTRY_TWO_LATTER, SSL_DOMAIN, COMPANY_EMAIL
}: SSLData) => {
  try {
    // execSync('openssl req -x509 -nodes -newkey rsa:2048 -keyout private.key -out certificate.crt -days 365 -subj "/CN=localhost"');
    // console.log('Self-signed certificate generated successfully.');
    console.log('Cert and Key not exist. So first need to create...');

    // const { privateKeyPath, certificatePath, PASS_PHASES, ORGANIZATION_NAME, UNITE_NAME, COMPANY_LOCALITY, COMPANY_STATE, COUNTRY_TWO_LATTER, SSL_DOMAIN, COMPANY_EMAIL } = data;

    execSync(
      `openssl genpkey -algorithm RSA:2048 -out ${privateKeyPath} -aes256 -pass pass:${PASS_PHASES}`
    );


    /*
      CN	Common Name	This is fully qualified domain name that you wish to secure	*.wikipedia.org
      O	Organization Name	Usually the legal name of a company or entity and should include any suffixes such as Ltd., Inc., or Corp.	Wikimedia Foundation, Inc.
      OU	Organizational Unit	Internal organization department/division name	IT
      L	Locality	Town, city, village, etc. name	San Francisco
      ST	State	Province, region, county or state. This should not be abbreviated (e.g. West Sussex, Normandy, New Jersey).	California
      C	Country	The two-letter ISO code for the country where your organization is located	US
      EMAIL	Email Address	The organization contact, usually of the certificate administrator or IT department	
    */


    execSync(
      `openssl req -new -key ${privateKeyPath} -x509 -out ${certificatePath} -passin pass:${PASS_PHASES} -subj "/C=${COUNTRY_TWO_LATTER}/ST=${COMPANY_STATE}/L=${COMPANY_LOCALITY}/O=${ORGANIZATION_NAME}/OU=${UNITE_NAME}/CN=${SSL_DOMAIN}/emailAddress=${COMPANY_EMAIL}" -days 365`
    );

    console.log('SSL certificate and key generated successfully.');

    // options['key'] = privateKey;
    // options['cert'] = certificate;
    // // options['passphrase'] = PASS_PHASES;

    return {
      key: readFileSync(privateKeyPath!),
      cert: readFileSync(certificatePath!)
    };
  } catch (err) {
    console.error('Failed to generate self-signed certificate:', err);
    process.exit(1);
  }
};

// First priority to finish
// LinkList
// Sortner method will call for every time whenever remove or add call
// Add --- incress the link of connection
// Remove --- decress the link of connection

// Second priority to finish
// 1. Create(contact & contacts)
// 2. Update message
// 3. Send SMS(Phone, WhatsApp)
// 4. Popup & ref of 1
// 5. Appointment & ref of 1

export class HocManager {
  // private modelName: string;
  private HocModel: Model<HocDocument>;

  constructor(hocModel: Model<HocDocument>) {
    // this.modelName = modelName;
    // mongoose.connect(mongoUrl);
    // this.HocModel = mongoose.model<HocDocument>(this.modelName, ContactSchema);
    this.HocModel = hocModel;
  }

  async sorterHoc(): Promise<void> {
    try {
      const sortedDocs: HocDocument[] = await this.HocModel.find()
        .sort({ last_name: 1 }); // O(n) = 1 - last contact

      const existLastName = sortedDocs.filter((con) => con.last_name); // O(n)  = 1 - last contact
      const notExistLastName = sortedDocs.filter((con) => !con.last_name); // O(n)  = 1 - last contact

      const contacts = [...existLastName, ...notExistLastName]; // O(1)

      for (let i = 0; i < contacts.length; i++) { // O(n)  = 1 - last contact
        contacts[i].customer_id = i + 1;
        await contacts[i].save();
      }
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  }

  async insertNewData(data: any): Promise<string | void> {
    try {
      const newData = new this.HocModel(data);
      await newData.save(); // O(1)
      await this.sorterHoc(); // O(n)
      return newData.last_name;
    } catch (err) {
      console.error('Error inserting new data:', err);
    }
  }

  async removeDocument(documentId: string): Promise<boolean | void> {
    try {
      // Remove the document by its _id
      await this.HocModel.findByIdAndRemove(documentId);
      await this.sorterHoc(); // O(n) Re-sort after removal
      return true;
    } catch (err) {
      console.error('Error removing document:', err);
    }
  }
};

// // Usage example:
// const hocManager = new HocManager('HocModel', process.env.MONGO_URL || 'mongodb://localhost:27017/CrmDB');

// // Call sorterHoc to initially sort the documents
// hocManager.sorterHoc();

// // Insert new data and automatically trigger sorting
// const newData = {
//   first_name: 'John',
//   last_name: 'Doe',
//   // Add other properties as needed
// };

// hocManager.insertNewData(newData);

// // Remove a document by its _id and automatically trigger sorting
// const documentIdToRemove = 'your_document_id_here';
// hocManager.removeDocument(documentIdToRemove);


// export const dataSortnerHocFor = (data: ArrayBuffer, MongoUrl: Modal) => {
// };

// Define your Mongoose schema
// const HocSchema = new Schema({
//   last_name: String,
//   // Add other properties as needed
//   customer_id: Number, // Add a customer_id field to the schema
// });

// // Define your Mongoose model
// interface HocDocument extends Document {
//   last_name: string;
//   // Add other properties as needed
//   customer_id: number; // Add  customer_id to the document interface
// }

// // Create a function to initialize and return the Mongoose model
// function createModel(mongoUrl: string, modelName: string): Model<HocDocument> {
//   // Connect to MongoDB using the provided URL
//   mongoose.connect(mongoUrl);

//   // Return the Mongoose model
//   return mongoose.model<HocDocument>(modelName, HocSchema);
// }

// // Function to sort and number documents
// async function sorterHoc(mongoUrl: string, modelName: string): Promise<void> {
//   try {
//     const HocModel = createModel(mongoUrl, modelName);

//     // Fetch and sort documents from MongoDB by last name and then by first name
//     const sortedDocs: HocDocument[] = await HocModel.find()
//     // .sort({ last_name: 1 });

//     const existLastName = sortedDocs.filter((con) => con.last_name).sort((a, b) => a?.last_name?.localeCompare(b?.last_name));
//     const notExistLastName = sortedDocs.filter((con) => !con.last_name);

//     // console.log("existLastName: ", existLastName.length);
//     // console.log("notExistLastName: ", notExistLastName.length);

//     const contacts = [...existLastName, ...notExistLastName];

//     // Update the serial numbers
//     for (let i = 0; i < contacts.length; i++) {
//       contacts[i].
//         customer_id = i + 1;
//       await contacts[i].save(); // Save the updated document
//     }
//   } catch (err) {
//     console.error('Error:', err);
//     throw err;
//   }
// };

// // Middleware to automatically update customer_id after a document is saved
// HocSchema.post('save', async (doc: HocDocument) => {
//   try {
//     // Call the sorterHoc function whenever a document is saved
//     await sorterHoc(process.env.MONGO_URL || 'mongodb://localhost:27017/your-database-name', 'HocModel');
//   } catch (err) {
//     console.error('Error in middleware:', err);
//   }
// });

// // Call the sorterHoc function when the server starts
// sorterHoc(process.env.MONGO_URL || 'mongodb://localhost:27017/your-database-name', 'HocModel');

// // Insert new data into the MongoDB collection
// async function insertNewData(mongoUrl: string, modelName: string) {
//   try {
//     const HocModel = createModel(mongoUrl, modelName);

//     const newData = new HocModel({
//       firstName: 'John',
//       last_name: 'Doe',
//       // Add other properties as needed
//     });
//     await newData.save(); // This will trigger the post('save') middleware
//   } catch (err) {
//     console.error('Error inserting new data:', err);
//   }
// };

// // Call the insertNewData function to insert new data
// insertNewData(process.env.MONGO_URL || 'mongodb://localhost:27017/your-database-name', 'HocModel');


// import { MongoClient, Db, Collection } from 'mongodb';

// // Define the MongoDB connection URL and database name
// const url = 'mongodb://localhost:27017';
// const dbName = 'your-database-name';

// // Define an interface for your documen0t structure (adjust as needed)
// interface HocDocument {
//   _id: string;
//   name: string;
//   // Add other properties as needed
// }

// import mongoose, { Document, Model, Schema } from 'mongoose';

// // Define your Mongoose schema
// const HocSchema = new Schema({
//   name: String,
//   // Add other properties as needed
// });

// // Define your Mongoose model
// interface HocDocument extends Document {
//   name: string;
//   // Add other properties as needed
// }

// import mongoose, { Document, Model, Schema } from 'mongoose';

// // Define your Mongoose schema
// const HocSchema = new Schema({
//   
//   last_name: String,
//   // Add other properties as needed
//   
// customer_id: Number, // Add a  customer_id field to the schema
// });

// // Define your Mongoose model
// interface HocDocument extends Document {
//   firstName: string;
//   last_name: string;
//   // Add other properties as needed
//   
// customer_id: number; // Add 
// customer_id to the document interface
// }

// const HocModel: Model<HocDocument> = mongoose.model<HocDocument>('HocModel', HocSchema);

// // Function to sort and number documents
// async function sorterHoc(): Promise<void> {
//   try {
//     // Fetch and sort documents from MongoDB by last name and then by first name
//     const sortedDocs: HocDocument[] = await HocModel.find()
//       .sort({ last_name: 1, firstName: 1 });

//     // Update the serial numbers
//     for (let i = 0; i < sortedDocs.length; i++) {
//       sortedDocs[i].
// customer_id = i + 1;
//       await sortedDocs[i].save(); // Save the updated document
//     }
//   } catch (err) {
//     console.error('Error:', err);
//     throw err;
//   }
// }

// // Middleware to automatically update 
// customer_id after a document is saved
// HocSchema.post('save', async (doc: HocDocument) => {
//   try {
//     await sorterHoc(); // Call the sorterHoc function whenever a document is saved
//   } catch (err) {
//     console.error('Error in middleware:', err);
//   }
// });

// // Connect to MongoDB and call the sorterHoc function
// async function connectAndSort() {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/your-database-name', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     await sorterHoc(); // Initial sorting when the server starts
//   } catch (err) {
//     console.error('Error:', err);
//   }
// }

// connectAndSort(); // Initial sorting when the server starts

// // Insert new data into the MongoDB collection
// async function insertNewData() {
//   try {
//     const newData = new HocModel({
//       firstName: 'John',
//       last_name: 'Doe',
//       // Add other properties as needed
//     });
//     await newData.save(); // This will trigger the post('save') middleware
//   } catch (err) {
//     console.error('Error inserting new data:', err);
//   }
// }

// // Call the insertNewData function to insert new data
// insertNewData();


// const HocModel: Model<HocDocument> = mongoose.model<HocDocument>('HocModel', HocSchema);

// // Function to sort and number documents
// async function sorterHoc(): Promise<HocDocument[]> {
//   try {
//     // Connect to MongoDB using Mongoose
//     await mongoose.connect('mongodb://localhost:27017/your-database-name', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     // Fetch documents from MongoDB and sort them alphabetically
//     const sortedDocs: HocDocument[] = await HocModel.find().sort({ name: 1 });

//     // Define a serial number variable
//     let 
// customer_id: number = 1;

//     // Iterate through sorted documents and add a serial number property
//     for (const doc of sortedDocs) {
//       doc['
// customer_id'] = 
// customer_id;
// //       
// customer_id++;
//     }

//     // Close the MongoDB connection
//     mongoose.connection.close();

//     // Return the sorted and numbered documents
//     return sortedDocs;
//   } catch (err) {
//     console.error('Error:', err);
//     throw err;
//   }
// }

// // Call the sorterHoc function to sort and number documents
// sorterHoc()
//   .then(sortedDocs => {
//     // Log or use the sorted and numbered documents as needed
//     console.log(sortedDocs);
//   })
//   .catch(err => {
//     console.error('Error:', err);
//   });


// // Function to sort and number documents
// async function sorterHoc(): Promise<HocDocument[]> {
//   try {
//     // Connect to MongoDB
//     const client = await MongoClient.connect(url, { useNewUrlParser: true });
//     const db: Db = client.db(dbName);

//     // Specify the collection you want to sort
//     const collection: Collection<HocDocument> = db.collection('your-collection-name');

//     // Fetch documents from MongoDB and sort them alphabetically
//     const sortedDocs: HocDocument[] = await collection.find().sort({ name: 1 }).toArray();

//     // Define a serial number variable
//     let 
// customer_id: number = 1;

//     // Iterate through sorted documents and add a serial number property
//     for (const doc of sortedDocs) {
//       doc.
// customer_id =
//   customer_id;
// //       
// customer_id++;
//     }

//     // Close the MongoDB connection
//     client.close();

//     // Return the sorted and numbered documents
//     return sortedDocs;
//   } catch (err) {
//     console.error('Error:', err);
//     throw err;
//   }
// }

// // Call the sorterHoc function to sort and number documents
// sorterHoc()
//   .then(sortedDocs => {
//     // Log or use the sorted and numbered documents as needed
//     console.log(sortedDocs);
//   })
//   .catch(err => {
//     console.error('Error:', err);
//   });


// // Import necessary MongoDB Node.js driver
// const MongoClient = require('mongodb').MongoClient;

// // Connection URL
// const url = 'mongodb://localhost:27017';

// // Database Name
// const dbName = 'your-database-name';

// // Function to sort and number documents
// async function sorterHoc() {
//   try {
//     // Connect to MongoDB
//     const client = await MongoClient.connect(url, { useNewUrlParser: true });
//     const db = client.db(dbName);

//     // Specify the collection you want to sort
//     const collection = db.collection('your-collection-name');

//     // Fetch documents from MongoDB and sort them alphabetically
//     const sortedDocs = await collection.find().sort({ name: 1 }).toArray();

//     // Define a serial number variable
//     let 
// customer_id = 1;

//     // Iterate through sorted documents and add a serial number property
//     for (const doc of sortedDocs) {
//       doc.
// customer_id =
//   customer_id;
// //       
// customer_id++;
//     }

//     // Close the MongoDB connection
//     client.close();

//     // Return the sorted and numbered documents
//     return sortedDocs;
//   } catch (err) {
//     console.error('Error:', err);
//   }
// }

// // Call the sorterHoc function to sort and number documents
// sorterHoc()
//   .then(sortedDocs => {
//     // Log or use the sorted and numbered documents as needed
//     console.log(sortedDocs);
//   })
//   .catch(err => {
//     console.error('Error:', err);
//   });
