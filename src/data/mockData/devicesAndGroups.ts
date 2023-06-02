export const devicesList = {
  content: [
    {
      alias: 'sourav',
      apps: [
        {
          changeLog: 'this is userpackage created by QA ',
          checkSum: '54f64fcc64bef74e8b754455fc495964',
          fileSize: '400',
          id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c',
          installedOn: 0,
          jobId: '1234',
          packageLocation: 'Edmonton',
          packageName: 'other_app3',
          packageVersion: '1.0.0-r1',
          packageVersionCode: 5,
          releaseDate: 2344444444,
          requestId: 123,
          s3BucketName: 'test',
          systemPackage: false,
          targetVersionCode: 4
        }
      ],
      assemblySerial: 'MDC_GV_001',
      certificateId: '8f49007adf629bd17a8598b7be61c62a3cf3c0fb86e3c595a5f572c5256115a9',
      cradlepointId: 'CP-7000000007',
      cradlepointMac: '18:9b:a5:40:5b:d7',
      customer: 'Proterra',
      dispenser1Id: '00120C2DF6D4CB01',
      dispenser2Id: '00120C2DF6C10501',
      dispenser3Id: '00120C2DF6DB3401',
      dispenser4Id: '00120C2DF6B34301',
      enrolledOn: 1562869800000,
      firmware: [
        {
          firmwareVersion: '4.19.78-linux4sam-6.2',
          releaseDate: 0,
          installedOn: 0,
          changeLog: 'sampledata',
          checkSum: 'sample data',
          fileSize: '150kb',
          jobId: '221121111sse2',
          packageLocation: 'lost angular',
          s3BucketName: 'name',
          signatureLocation: 'location',
          status: 'processing'
        }
      ],
      firmwareUpdateRequest: [
        {
          firmwareVersion: '4.19.78-linux4sam-6.2',
          releaseDate: 0,
          installedOn: 0,
          changeLog: 'sampledata',
          checkSum: 'sample data',
          fileSize: '150kb',
          jobId: '221121111sse2',
          packageLocation: 'lost angular',
          s3BucketName: 'name',
          signatureLocation: 'location',
          status: 'processing'
        }
      ],
      group: {
        name: 'Lorem Ipsum'
      },
      location: {
        address: 'Bangalore',
        zip: 0
      },
      macid: '86C4D8E15139',
      model: 'SP60',
      pcs: 'Proterra-PCS-60',
      serial: '86C4D8E15139',
      simiccid: '8991101200003204514',
      status: 0,
      uptime: 878400000
    }
  ],
  totalElements: 120,
  number: 10,
  size: 10,
  numberOfElements: 10,
  firmwareUpdateRequest: true,
};

export const groupList = {
  content: [
    {
      createdOn: 1597770475535,
      id: '1dc47a8e-6b4d-4abb-af1a-44bd10021055',
      deviceCount: 6,
      name: 'P12_updated!',
    }
  ],
  totalElements: 15,
  number: 10,
  size: 10,
  numberOfElements: 10,
};
export const groupDetails = {
  name: 'demo',
  createdOn: 1598543142149,
  id: '35e599af-4891-4953-a956-8a31bc92c300',
  deviceCount: 2
};

export const deviceDetails = {
  alias: 'sourav',
  apps: [
    {
      changeLog: 'this is userpackage created by QA ',
      checkSum: '54f64fcc64bef74e8b754455fc495964',
      fileSize: '400',
      id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c',
      installedOn: 0,
      jobId: '1234',
      packageLocation: 'Edmonton',
      packageName: 'other_app3',
      packageVersion: '1.0.0-r1',
      packageVersionCode: 5,
      releaseDate: 2344444444,
      requestId: 123,
      s3BucketName: 'test',
      systemPackage: false,
      targetVersionCode: 4
    }
  ],
  assemblySerial: 'MDC_GV_001',
  certificateId: '8f49007adf629bd17a8598b7be61c62a3cf3c0fb86e3c595a5f572c5256115a9',
  cradlepointId: 'CP-7000000007',
  cradlepointMac: '18:9b:a5:40:5b:d7',
  customer: 'Proterra',
  dispenser1Id: '00120C2DF6D4CB01',
  dispenser2Id: '00120C2DF6C10501',
  dispenser3Id: '00120C2DF6DB3401',
  dispenser4Id: '00120C2DF6B34301',
  enrolledOn: 1562869800000,
  firmware: '4.19.78-linux4sam-6.2',
  group: {
    name: 'Lorem Ipsum'
  },
  location: {
    address: 'Bangalore',
    zip: 0
  },
  macid: '18:9b:a5:40:5b:d6',
  model: 'SP60',
  pcs: 'Proterra-PCS-60',
  serial: '86C4D8E15139',
  simiccid: '8991101200003204514',
  status: 0,
  uptime: 878400000
};

export let config = {
  totalItems: 1,
  currentPage: 1,
  noOfElements: 1,
  itemsPerPage: 10
};

export let tableColumnHeaders: any = {
  macid: true,
  alias: true,
  customer: true,
  group: true,
  enrolled_on: true,
  location: true,
  status: true,
  uptime: true,
  warning: true,
  action: true,
  serial: true,
  simiccid: true,
  cradlepoint_id: true,
  last_heard: true
};

export let rowSelected = [{
  apps: [
    {
      changeLog: 'this is userpackage created by QA ',
      checkSum: '54f64fcc64bef74e8b754455fc495964',
      fileSize: '400',
      id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c',
      installedOn: 0,
      jobId: '1234',
      packageLocation: 'Edmonton',
      packageName: 'other_app3',
      packageVersion: '1.0.0-r1',
      packageVersionCode: 5,
      releaseDate: 2344444444,
      requestId: 123,
      s3BucketName: 'test',
      systemPackage: false,
      targetVersionCode: 4
    }
  ],
  assemblySerial: 'MDC_GV_001',
  certificateId: '8f49007adf629bd17a8598b7be61c62a3cf3c0fb86e3c595a5f572c5256115a9',
  cradlepointId: 'CP-7000000007',
  cradlepointMac: '18:9b:a5:40:5b:d7',
  customer: 'Proterra',
  dispenser1Id: '00120C2DF6D4CB01',
  dispenser2Id: '00120C2DF6C10501',
  dispenser3Id: '00120C2DF6DB3401',
  dispenser4Id: '00120C2DF6B34301',
  enrolledOn: 1562869800000,
  firmware: '4.19.78-linux4sam-6.2',
  group: {
    name: 'group1'
  },
  location: {
    address: 'Bangalore',
    zip: 0
  },
  macid: '86C4D8E15139',
  model: 'SP60',
  pcs: 'Proterra-PCS-60',
  serial: '86C4D8E15139',
  simiccid: '8991101200003204514',
  status: 0,
  uptime: 878400000
}, {
  apps: [
    {
      changeLog: 'this is userpackage created by QA ',
      checkSum: '54f64fcc64bef74e8b754455fc495964',
      fileSize: '400',
      id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c',
      installedOn: 0,
      jobId: '1234',
      packageLocation: 'Edmonton',
      packageName: 'other_app3',
      packageVersion: '1.0.0-r1',
      packageVersionCode: 5,
      releaseDate: 2344444444,
      requestId: 123,
      s3BucketName: 'test',
      systemPackage: false,
      targetVersionCode: 4
    }
  ],
  assemblySerial: 'MDC_GV_001',
  certificateId: '8f49007adf629bd17a8598b7be61c62a3cf3c0fb86e3c595a5f572c5256115a9',
  cradlepointId: 'CP-7000000007',
  cradlepointMac: '18:9b:a5:40:5b:d7',
  customer: 'Proterra',
  dispenser1Id: '00120C2DF6D4CB01',
  dispenser2Id: '00120C2DF6C10501',
  dispenser3Id: '00120C2DF6DB3401',
  dispenser4Id: '00120C2DF6B34301',
  enrolledOn: 1562869800000,
  firmware: '4.19.78-linux4sam-6.2',
  group: {
    name: 'group1'
  },
  location: {
    address: 'Bangalore',
    zip: 0
  },
  macid: '86C4D8E15139',
  model: 'SP60',
  pcs: 'Proterra-PCS-60',
  serial: '86C4D8E15139',
  simiccid: '8991101200003204514',
  status: 0,
  uptime: 878400000
}];

export let devicesListGrid = [{
  apps: [
    {
      changeLog: 'this is userpackage created by QA ',
      checkSum: '54f64fcc64bef74e8b754455fc495964',
      fileSize: '400',
      id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c',
      installedOn: 0,
      jobId: '1234',
      packageLocation: 'Edmonton',
      packageName: 'other_app3',
      packageVersion: '1.0.0-r1',
      packageVersionCode: 5,
      releaseDate: 2344444444,
      requestId: 123,
      s3BucketName: 'test',
      systemPackage: false,
      targetVersionCode: 4
    }
  ],
  assemblySerial: 'MDC_GV_001',
  certificate: {
    certificateCheckSum: 'sample data',
    certificateFileLocation: 'sample data',
    certificateId: 'sample data',
    certificateSignatureLocation: 'sample data',
    commonName: 'sample data',
    country: 'sample data',
    deviceSerial: 'sample data',
    expiresOn: 1111,
    issuedOn: 2222,
    keyCheckSum: 'sample data',
    keyFileLocation: 'sample data',
    keySignatureLocation: 'sample data',
    locality: 'sample data',
    orgUnit: 'sample data',
    organisation: 'sample data',
    s3BucketName: 'sample data',
    state: 'sample data',
    status: 'sample data'
  },
  certificateUpdateRequest: {
    certificateCheckSum: 'sample data',
    certificateFileLocation: 'sample data',
    certificateId: 'sample data',
    certificateSignatureLocation: 'sample data',
    commonName: 'sample data',
    country: 'sample data',
    deviceSerial: 'sample data',
    expiresOn: 1111,
    issuedOn: 2222,
    keyCheckSum: 'sample data',
    keyFileLocation: 'sample data',
    keySignatureLocation: 'sample data',
    locality: 'sample data',
    orgUnit: 'sample data',
    organisation: 'sample data',
    s3BucketName: 'sample data',
    state: 'sample data',
    status: 'sample data'
  },
  certificateId: '8f49007adf629bd17a8598b7be61c62a3cf3c0fb86e3c595a5f572c5256115a9',
  cradlepointId: 'CP-7000000007',
  cradlepointMac: '18:9b:a5:40:5b:d7',
  customer: 'Proterra',
  dispenser1Id: '00120C2DF6D4CB01',
  dispenser2Id: '00120C2DF6C10501',
  dispenser3Id: '00120C2DF6DB3401',
  dispenser4Id: '00120C2DF6B34301',
  enrolledOn: 1562869800000,
  firmware: [
    {
      firmwareVersion: '4.19.78-linux4sam-6.2',
      releaseDate: 0,
      installedOn: 0,
      changeLog: 'sampledata',
      checkSum: 'sample data',
      fileSize: '150kb',
      jobId: '221121111sse2',
      packageLocation: 'lost angular',
      s3BucketName: 'name',
      signatureLocation: 'location',
      status: 'processing'
    }
  ],
  firmwareUpdateRequest: [
    {
      firmwareVersion: '4.19.78-linux4sam-6.2',
      releaseDate: 0,
      installedOn: 0,
      changeLog: 'sampledata',
      checkSum: 'sample data',
      fileSize: '150kb',
      jobId: '221121111sse2',
      packageLocation: 'lost angular',
      s3BucketName: 'name',
      signatureLocation: 'location',
      status: 'processing'
    }
  ],
  group: {
    name: 'Lorem Ipsum'
  },
  location: {
    address: 'Bangalore',
    zip: 0
  },
  macid: '18:9b:a5:40:5b:d6',
  model: 'SP60',
  pcs: 'Proterra-PCS-60',
  serial: 'MDC-1',
  simiccid: '8991101200003204514',
  status: 0,
  uptime: 878400000
}, {
  apps: [
    {
      changeLog: 'this is userpackage created by QA ',
      checkSum: '54f64fcc64bef74e8b754455fc495964',
      fileSize: '400',
      id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c',
      installedOn: 0,
      jobId: '1234',
      packageLocation: 'Edmonton',
      packageName: 'other_app3',
      packageVersion: '1.0.0-r1',
      packageVersionCode: 5,
      releaseDate: 2344444444,
      requestId: 123,
      s3BucketName: 'test',
      systemPackage: false,
      targetVersionCode: 4
    }
  ],
  assemblySerial: 'MDC_GV_001',
  certificate: {
    certificateCheckSum: 'sample data',
    certificateFileLocation: 'sample data',
    certificateId: 'sample data',
    certificateSignatureLocation: 'sample data',
    commonName: 'sample data',
    country: 'sample data',
    deviceSerial: 'sample data',
    expiresOn: 1111,
    issuedOn: 2222,
    keyCheckSum: 'sample data',
    keyFileLocation: 'sample data',
    keySignatureLocation: 'sample data',
    locality: 'sample data',
    orgUnit: 'sample data',
    organisation: 'sample data',
    s3BucketName: 'sample data',
    state: 'sample data',
    status: 'sample data'
  },
  certificateUpdateRequest: {
    certificateCheckSum: 'sample data',
    certificateFileLocation: 'sample data',
    certificateId: 'sample data',
    certificateSignatureLocation: 'sample data',
    commonName: 'sample data',
    country: 'sample data',
    deviceSerial: 'sample data',
    expiresOn: 1111,
    issuedOn: 2222,
    keyCheckSum: 'sample data',
    keyFileLocation: 'sample data',
    keySignatureLocation: 'sample data',
    locality: 'sample data',
    orgUnit: 'sample data',
    organisation: 'sample data',
    s3BucketName: 'sample data',
    state: 'sample data',
    status: 'sample data'
  },
  certificateId: '8f49007adf629bd17a8598b7be61c62a3cf3c0fb86e3c595a5f572c5256115a9',
  cradlepointId: 'CP-7000000007',
  cradlepointMac: '18:9b:a5:40:5b:d7',
  customer: 'Proterra',
  dispenser1Id: '00120C2DF6D4CB01',
  dispenser2Id: '00120C2DF6C10501',
  dispenser3Id: '00120C2DF6DB3401',
  dispenser4Id: '00120C2DF6B34301',
  enrolledOn: 1562869800000,
  firmware: [
    {
      firmwareVersion: '4.19.78-linux4sam-6.2',
      releaseDate: 0,
      installedOn: 0,
      changeLog: 'sampledata',
      checkSum: 'sample data',
      fileSize: '150kb',
      jobId: '221121111sse2',
      packageLocation: 'lost angular',
      s3BucketName: 'name',
      signatureLocation: 'location',
      status: 'processing'
    }
  ],
  firmwareUpdateRequest: [
    {
      firmwareVersion: '4.19.78-linux4sam-6.2',
      releaseDate: 0,
      installedOn: 0,
      changeLog: 'sampledata',
      checkSum: 'sample data',
      fileSize: '150kb',
      jobId: '221121111sse2',
      packageLocation: 'lost angular',
      s3BucketName: 'name',
      signatureLocation: 'location',
      status: 'processing'
    }
  ],
  group: {
    name: 'Lorem Ipsum'
  },
  location: {
    address: 'Bangalore',
    zip: 0
  },
  macid: '18:9b:a5:40:5b:d6',
  model: 'SP60',
  pcs: 'Proterra-PCS-60',
  serial: 'MDC-1',
  simiccid: '8991101200003204514',
  status: 0,
  uptime: 878400000
}];

export let deviceGroups = [
  {
    name: 'demo',
    createdOn: 1598543142149,
    id: '35e599af-4891-4953-a956-8a31bc92c300',
    deviceCount: 1
  },
  {
    name: 'userpreference',
    createdOn: 1598625611410,
    id: 'd59adcc3-32c8-45d9-b244-7d3b2ee5eaaf',
    deviceCount: 0
  }
];
export let GroupsSelected = [
  {
    name: 'demo',
    createdOn: 1598543142149,
    id: '35e599af-4891-4953-a956-8a31bc92c300',
    deviceCount: 1
  },
  {
    name: 'userpreference',
    createdOn: 1598625611410,
    id: 'd59adcc3-32c8-45d9-b244-7d3b2ee5eaaf',
    deviceCount: 0
  }
];

export const MetricsMock = {
  booting: 3,
  idle: 2,
  offline: 6,
  online: 8,
};

export const UnassignedDevicesMock = {
  content: [

  ],
  pageable: {
    sort: {
      sorted: false,
      unsorted: true,
      empty: true
    },
    pageNumber: 0,
    pageSize: 10,
    offset: 0,
    paged: true,
    unpaged: false
  },
  totalPages: 0,
  totalElements: 0,
  last: true,
  first: true,
  sort: {
    sorted: false,
    unsorted: true,
    empty: true
  },
  numberOfElements: 0,
  size: 10,
  number: 0,
  empty: true
};

export const FirmwareMock =
  [
    {
      firmwareVersion: 'v05.10.2020-HF123',
      releaseDate: 1601900546022,
      changeLog: '### Platform v05.10.2020-HF123  2020-10-05\n',
      packageLocation: 'platform_daily/FOTA_intermittent_builds/v05.10.2020-HF123',
      signatureLocation: 'platform_daily/FOTA_intermittent_builds/v05.10.2020-HF123',
      s3BucketName: 'mdc-builds',
      fileSize: '68MB',
      checkSum: 'b3ac09b731a1787ef5d5f330a776c4e3',
      installedOn: 0,
      available: true
    },
    {
      firmwareVersion: 'v04.10.2020-HF123',
      releaseDate: 1601819325752,
      changeLog: '### Platform v04.10.2020-HF123  2020-10-04\n',
      packageLocation: 'platform_daily/63_20201004134326',
      signatureLocation: 'platform_daily/63_20201004134326/',
      s3BucketName: 'mdc-builds',
      fileSize: '68MB',
      checkSum: 'd62c88839f450f75a01296f4d47849d0',
      installedOn: 0,
      available: true
    }
  ];

export const DevicesListMock = {
  content: [
    {
      apps: [

      ],
      assembly_serial: 'MDC_GV_001',
      certificate_id: 'HoozGx54JQbGIN2REKM1qx7YQDgAokmBxAg4ubhDlxlPcbKqfVdAAvTQJTIjeYLD',
      cradlepoint_id: 'CP-70000000051',
      cradlepoint_mac: '23165AE7E2F6',
      enrolled_on: 1599239269959,
      macid: '0676D5032FEE',
      model: 'SP60',
      pcs: 'Proterra-PCS-60',
      serial: '0676D5032FEE',
      simiccid: 'D08407B05A7E',
      status: 0,
      vendor: 'Proterra',
      lastSeen: 0,
      uptime: 0,
      group: 'new_test',
      location: 'Hyderabad',
      locationZip: '654321',
      customer: 'Customer3',
      alias: 'QA_test-device',
      dispensers: [

      ]
    },
    {
      apps: [

      ],
      assembly_serial: 'f5d7f812-2d5a-4ae9-8255-4102197d8dbd',
      certificate_id: 'U6lDvjPLriiFKRF0yZu711E6WQ5nvxEEo4AcUbhyq6XpS5OhiEsJ42VhH60Wsx4k',
      cradlepoint_id: '1f9fce97-9d67-4439-83df-006eb42d2c13',
      cradlepoint_mac: 'ASDF214233523',
      enrolled_on: 1599239194171,
      macid: '57E6068AE79A',
      model: 'SP60',
      pcs: '00120C2DF6B03F011',
      serial: '57E6068AE79A',
      simiccid: 'KMNO',
      status: 0,
      vendor: 'Proterra',
      lastSeen: 0,
      uptime: 0,
      group: 'new_test',
      location: '15520 Ellerslie Rd SW, Edmonton, AB T6W 1A4, US Edmonton',
      locationZip: '247551',
      customer: '49610db5-d698-4067-8b09-cdb307866709',
      alias: 'QA_test_device',
      dispensers: [
        {
          id: '0d4104a4-6415-40b6-9d82-90f0ee1b7367'
        }
      ]
    }
  ],
  pageable: {
    sort: {
      sorted: false,
      unsorted: true,
      empty: true
    },
    pageSize: 10,
    pageNumber: 0,
    offset: 0,
    paged: true,
    unpaged: false
  },
  totalPages: 1,
  totalElements: 2,
  last: true,
  first: true,
  sort: {
    sorted: false,
    unsorted: true,
    empty: true
  },
  numberOfElements: 2,
  size: 10,
  number: 0,
  empty: false
};

export const InstalledAppsMock = {
  changeLog: 'sample',
  checkSum: 'sample',
  fileSize: 'sample',
  id: 'sample',
  installedOn: 1,
  jobId: 'sample',
  packageLocation: 'sample',
  packageName: 'sample',
  packageVersion: 'sample',
  packageVersionCode: 3,
  releaseDate: 2,
  requestId: 2,
  s3BucketName: 'sample',
  status: 'sample',
  systemPackage: true,
  targetVersionCode: 5
};

export  const singleDevice = [{
  apps: [
    {
      changeLog: 'this is userpackage created by QA ',
      checkSum: '54f64fcc64bef74e8b754455fc495964',
      fileSize: '400',
      id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c',
      installedOn: 0,
      jobId: '1234',
      packageLocation: 'Edmonton',
      packageName: 'other_app3',
      packageVersion: '1.0.0-r1',
      packageVersionCode: 5,
      releaseDate: 2344444444,
      requestId: 123,
      s3BucketName: 'test',
      systemPackage: false,
      targetVersionCode: 4
    }
  ],
  assemblySerial: 'MDC_GV_001',
  certificateId: '8f49007adf629bd17a8598b7be61c62a3cf3c0fb86e3c595a5f572c5256115a9',
  cradlepointId: 'CP-7000000007',
  cradlepointMac: '18:9b:a5:40:5b:d7',
  customer: 'Proterra',
  dispenser1Id: '00120C2DF6D4CB01',
  dispenser2Id: '00120C2DF6C10501',
  dispenser3Id: '00120C2DF6DB3401',
  dispenser4Id: '00120C2DF6B34301',
  enrolledOn: 1562869800000,
  firmware: '4.19.78-linux4sam-6.2',
  group: {
    name: 'group1'
  },
  location: {
    address: 'Bangalore',
    zip: 0
  },
  macid: '86C4D8E15139',
  model: 'SP60',
  pcs: 'Proterra-PCS-60',
  serial: '86C4D8E15139',
  simiccid: '8991101200003204514',
  status: 0,
  uptime: 878400000
}];
