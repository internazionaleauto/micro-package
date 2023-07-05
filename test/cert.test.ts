import path from 'path';
import { existsSync } from 'fs';
import { CertificateInft } from '../inft';
import { getOrCreateSSHCertificate } from '../src';
import { beforeAll, describe, expect, test } from '@jest/globals';

let keys: CertificateInft;

beforeAll(() => {
  keys = {
    PATH: 'cert',
    SERVER_URI: 'https://localhost:*',
    PASS_PHASES: '55068',
    WHER_COMPANY: 'IT',
    COMPANY_UNITE: '12',
    COMPANY_EMAIL: 'web@intil.com',
    COMPANY_STATE: 'PD',
    COMPANY_LOCAL_NAME: 'Intil',
    COMPANY_ORGANIZATION: 'Intil',
  };
});

describe('Genarate or verify SSH certificate', () => {
  // console.log("keys", keys);
  const certFolder = `${path.resolve(__dirname, '../')}/cert`;

  const privateKeyPath = `${certFolder}/private_key.pem`;
  const certificatePath = `${certFolder}/certificate.pem`;

  if (
    existsSync(certFolder) &&
    existsSync(privateKeyPath) &&
    existsSync(certificatePath)
  ) {
    test('Func: Verify SSH', () => {
      expect(getOrCreateSSHCertificate(keys)).toEqual(true);
    });
  } else {
    test('Func: Create SSH', () => {
      expect(getOrCreateSSHCertificate(keys)).toEqual(false);
    });
  }
});
