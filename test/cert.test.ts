import { SSLData } from '../inft';
import { getOrCreateSSHCertificate } from '../src';
import { jest, beforeAll, beforeEach, afterAll, describe, expect, test } from '@jest/globals';

let keys: SSLData;

beforeAll(() => {
  console.log("Start createing SSL Certificate");
});

beforeEach(() => {
  keys = {
    PASS_PHASES: '55068',
    COMPANY_LOCALITY: 'IT',
    COMPANY_STATE: 'Padova',
    COUNTRY_TWO_LATTER: "IT",
    UNITE_NAME: 'IT Department',
    PATH: `${process.cwd()}/cert`,
    ORGANIZATION_NAME: 'Intil',
    COMPANY_EMAIL: 'web@intil.com',
    SSL_DOMAIN: 'https://localhost:*',
  };
});

describe('Genarate or verify SSH certificate', () => {

  test('Func: Verify SSH', () => {

    // console.log("keys", keys);
    // const certFolder = `${process.cwd}/${keys.PATH}`;

    // const privateKeyPath = `${certFolder}/private_key.pem`;
    // const certificatePath = `${certFolder}/certificate.pem`;

    const { options } = getOrCreateSSHCertificate(keys);

    // console.log("options", options);
    const { cert, key, passphrase } = options;

    // console.log('cert', cert);
    // console.log('cert type', typeof cert);

    expect(typeof key).toEqual("object");
    expect(typeof cert).toEqual("object");
    expect(passphrase).toEqual(keys.PASS_PHASES);
  });
  // if (
  //   existsSync(certFolder) &&
  //   existsSync(privateKeyPath) &&
  //   existsSync(certificatePath)
  // ) {
  // } else {
  //   test('Func: Create SSH', () => {
  //     expect(getOrCreateSSHCertificate(keys)).toEqual(false);
  //   });
  // }
});

afterAll((done) => {
  jest.clearAllMocks();
  done();
})