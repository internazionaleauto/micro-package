import path from 'path';
import { execSync } from 'child_process';
import { CertOptions, SSLData } from '../inft';
import { readFileSync, existsSync } from 'fs';

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
      `openssl genpkey -algorithm RSA -out ${privateKeyPath} -aes256 -pass pass:${PASS_PHASES}`
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
