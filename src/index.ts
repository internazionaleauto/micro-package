import path from 'path';
import { execSync } from 'child_process';
import { CertOptions, CertificateInft } from '../inft';
import { readFileSync, existsSync } from 'fs';

export const getOrCreateSSHCertificate = ({
  PATH,
  SERVER_URI,
  PASS_PHASES,
  WHER_COMPANY,
  COMPANY_EMAIL,
  COMPANY_STATE,
  COMPANY_UNITE,
  COMPANY_LOCAL_NAME,
  COMPANY_ORGANIZATION,
}: CertificateInft): { options: CertOptions } => {

  // console.log("PATH", PATH);
  // console.log("__dirname", __dirname);

  const certFolder = `${process.cwd()}/${PATH}`;

  console.log("certFolder", certFolder);

  if (!existsSync(certFolder)) {
    execSync(`mkdir ${certFolder}`);
  };

  // console.log("keys", keys);

  const options: CertOptions = {
    key: '',
    cert: '',
    passphrase: ''
  };

  const privateKeyPath = `${certFolder}/private_key.pem`;
  const certificatePath = `${certFolder}/certificate.pem`;

  // const { PASS_PHASES, WHER_COMPANY, COMPANY_STATE, COMPANY_LOCAL_NAME, COMPANY_ORGANIZATION, COMPANY_UNITE, SERVER_URI, COMPANY_EMAIL } = keys;

  // Check certificate is exist or not
  if (!existsSync(privateKeyPath) || !existsSync(certificatePath)) {

    const { key, cert } = generateCertificate(
      SERVER_URI,
      PASS_PHASES,
      WHER_COMPANY,
      COMPANY_STATE,
      COMPANY_EMAIL,
      COMPANY_UNITE,
      privateKeyPath,
      certificatePath,
      COMPANY_LOCAL_NAME,
      COMPANY_ORGANIZATION,
    );

    options['key'] = key;
    options['cert'] = cert;
    options['passphrase'] = PASS_PHASES;

    return {
      options
    };

  } else {

    // Read the private key and certificate files
    const privateKey = readFileSync(privateKeyPath);
    const certificate = readFileSync(certificatePath);

    options['key'] = privateKey;
    options['cert'] = certificate;
    options['passphrase'] = PASS_PHASES;

    return {
      options
    };

  }
};

// Generate a self-signed SSL certificate and key
const generateCertificate = (
  SERVER_URI: string,
  PASS_PHASES: string,
  WHER_COMPANY: string,
  COMPANY_STATE: string,
  COMPANY_EMAIL: string,
  COMPANY_UNITE: string,
  privateKeyPath: string,
  certificatePath: string,
  COMPANY_LOCAL_NAME: string,
  COMPANY_ORGANIZATION: string
) => {
  try {
    // execSync('openssl req -x509 -nodes -newkey rsa:2048 -keyout private.key -out certificate.crt -days 365 -subj "/CN=localhost"');
    // console.log('Self-signed certificate generated successfully.');
    console.log('Cert and Key not exist. So first need to create...');

    execSync(
      `openssl genpkey -algorithm RSA -out ${privateKeyPath} -aes256 -pass pass:${PASS_PHASES}`
    );

    execSync(
      `openssl req -new -key ${privateKeyPath} -x509 -out ${certificatePath} -passin pass:${PASS_PHASES} -subj "/C=${WHER_COMPANY}/ST=${COMPANY_STATE}/L=${COMPANY_LOCAL_NAME}/O=${COMPANY_ORGANIZATION}/OU=${COMPANY_UNITE}/CN=${SERVER_URI}/emailAddress=${COMPANY_EMAIL}" -days 365`
    );

    console.log('SSL certificate and key generated successfully.');

    // options['key'] = privateKey;
    // options['cert'] = certificate;
    // // options['passphrase'] = PASS_PHASES;

    return {
      key: readFileSync(privateKeyPath),
      cert: readFileSync(certificatePath)
    };
  } catch (err) {
    console.error('Failed to generate self-signed certificate:', err);
    process.exit(1);
  }
};
