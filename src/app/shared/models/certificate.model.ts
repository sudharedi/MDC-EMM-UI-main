export class CertificateResponse {
  certificateCheckSum: string;
  certificateFileLocation: string;
  certificateId: string;
  certificateSignatureLocation: string;
  commonName: string;
  country: string;
  deviceSerial: string;
  expiresOn: number;
  issuedOn: number;
  keyCheckSum: string;
  keyFileLocation: string;
  keySignatureLocation: string;
  locality: string;
  orgUnit: string;
  organisation: string;
  s3BucketName: string;
  state: string;
  code?: number;
}
