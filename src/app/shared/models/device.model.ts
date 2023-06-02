export class InstalledApps {
  changeLog: string;
  checkSum: string;
  fileSize: string;
  id: string;
  installedOn: number;
  jobId: string;
  packageLocation: string;
  packageName: string;
  packageVersion: string;
  packageVersionCode: number;
  releaseDate: number;
  requestId: number;
  s3BucketName: string;
  status?: string;
  systemPackage: boolean;
  targetVersionCode: number;
}
export class FirmwareResponse {
  changeLog: string;
  checkSum: string;
  fileSize: string;
  firmwareVersion: string;
  installedOn: number;
  jobId: string;
  packageLocation: string;
  releaseDate: number;
  s3BucketName: string;
  signatureLocation: string;
  status: string;
}

export class DeviceGroup {
  name?: string;
}

export class Location {
  address?: string;
  zip?: number;
}

export class Certificate {
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
  status: string;
}

export class Device {
  apps: InstalledApps[];
  firmware: FirmwareResponse[];
  firmwareUpdateRequest: FirmwareResponse[];
  assemblySerial?: string;
  certificate ? = new Certificate();
  certificateUpdateRequest ? = new Certificate();
  certificateId?: string;
  cradlepointId?: string;
  cradlepointMac?: string;
  customer?: string;
  dispenser1Id?: string;
  dispenser2Id?: string;
  dispenser3Id?: string;
  dispenser4Id?: string;
  enrolledOn?: number;
  enrolled_on?: number;
  group ? = new DeviceGroup();
  location = new Location();
  lastSeen?: string;
  macid: string;
  model?: string;
  pcs?: string;
  serial: string;
  simiccid: string;
  status?: number;
  uptime?: number;
  checked?: boolean;
  diffDays?: any;
  presence?: string;
  uptime_converted?: string;
}

export class DeviceListResponse {
  content: Device[];
  totalElements: number;
  number: number;
  size: number;
  numberOfElements: any;
  code?: number;
}
