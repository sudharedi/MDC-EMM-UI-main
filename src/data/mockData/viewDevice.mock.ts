export const GroupNamesMock = [
    {
        createdOn: 1598942482905,
        deviceCount: 0,
        id: '70846d1a-1f69-47f9-80d5-6d2bf6a5e292',
        name: 'new_test',
    },
    {
        createdOn: 1600105388255,
        deviceCount: 0,
        id: 'b824136a-d895-4970-8580-5fd640fba7db',
        name: 'TEST_GRP',
    },
    {
        createdOn: 1601376248293,
        deviceCount: 0,
        id: 'c2a6a6d6-dca1-4598-9c0b-d7056e1d29fe',
        name: 'QA_devices',
    }
];

export const ConfigValuesMock = {
    configs: [
        {
            advanceParam: false,
            boolValue: false,
            description: 'Charging Sequence',
            displayName: 'Dispenser Charging Sequence',
            intValue: 0,
            maximum: 4,
            minimum: 1,
            name: 'charge_seq',
            strValue: '1,2,3,4',
            type: 'text',
            unit: '%',
        },
        {
            advanceParam: false,
            boolValue: false,
            description: 'Bulk Charge Limit for Dispenser in Slot 1',
            displayName: 'Dispenser 1 Bulk SOC',
            intValue: 9,
            maximum: 110,
            minimum: 1,
            name: 'd1_bulk_soc',
            strValue: null,
            type: 'number',
            unit: '%',
        }
    ],
    lastModifiedBy: 'alok',
    lastModifiedDate: '2020-10-07T11:08:50.693+0000',
    serial: '189ba5405bd2',
    status: 0,
};

export const DeviceDetailsMock = {
    alias: 'postmanadded',
    apps: [],
    certificate_id: 'eydnauehandu389233uhanas9823esaae',
    dispensers: [
        { id: 'WatZDl8s5t' },
        { id: '65tH0hXdN5' },
        { id: 'i2sxMxfj0h' },
        { id: '4xxd8StmQb' },
    ],
    enrolled_on: 0,
    group: 'QA_tests',
    lastSeen: 0,
    location: 'Hyderabad',
    locationZip: '5000020',
    macid: 'EF:12:HI:34:JK:56',
    serial: 'EF12HI34JK56',
    status: 0,
    uptime: 0,
};

export const FectAllMock = [
    {
        available: true,
        changeLog: '### mdc-apps v3.0.8  2020-10-07',
        checkSum: '886cab09a2eb862954075337bf17d86b',
        fileSize: '576KB',
        id: '569f8013-4a0d-41ad-b481-b999d2dc7e9c',
        installedOn: 0,
        packageLocation: 'platform_daily/SOTA_intermittent_builds/v3.0.8-r1/mdc-apps-3.0.8-r1.cortexa5t2hf_neon_vfpv4.rpm',
        packageName: 'mdc-apps',
        packageVersion: '3.0.8-r1',
        releaseDate: 1602046793693,
        s3BucketName: 'mdc-builds',
        signatureLocation: 'platform_daily/SOTA_intermittent_builds/v3.0.8-r1/mdc-apps-3.0.8-r1.cortexa5t2hf_neon_vfpv4.rpm.signed',
        status: 'NA',
        systemPackage: true,
        targetFirmware: 'v28.09.2020-HF123',
    },
    {
        available: true,
        changeLog: '### mdc-apps v3.0.7  2020-10-07',
        checkSum: '6516427d4c5e9a381f0e388d426f007c',
        fileSize: '575KB',
        id: '6d6fd7b0-d1c8-449d-a975-66514ece4625',
        installedOn: 0,
        packageLocation: 'platform_daily/SOTA_intermittent_builds/v3.0.7-r1/mdc-apps-3.0.7-r1.cortexa5t2hf_neon_vfpv4.rpm',
        packageName: 'mdc-apps',
        packageVersion: '3.0.7-r1',
        releaseDate: 1602046003409,
        s3BucketName: 'mdc-builds',
        signatureLocation: 'platform_daily/SOTA_intermittent_builds/v3.0.7-r1/mdc-apps-3.0.7-r1.cortexa5t2hf_neon_vfpv4.rpm.signed',
        status: 'NA',
        systemPackage: true,
        targetFirmware: 'v28.09.2020-HF123',
    },
    {
        available: true,
        changeLog: '### mdc-apps v3.0.1  2020-10-01',
        checkSum: '29c78e31833b21d2aed7a84079eb4fc3',
        fileSize: '576KB',
        id: 'd022ab39-36cf-450a-a97f-afe71f933e38',
        installedOn: 0,
        packageLocation: 'platform_daily/66_20201006104733/mdc-apps-3.0.1-r2.cortexa5t2hf_neon_vfpv4.rpm',
        packageName: 'mdc-apps',
        packageVersion: '3.0.1-r2',
        releaseDate: 1601981541659,
        s3BucketName: 'mdc-builds',
        signatureLocation: 'platform_daily/66_20201006104733/mdc-apps-3.0.1-r2.cortexa5t2hf_neon_vfpv4.rpm.signed',
        status: 'NA',
        systemPackage: true,
        targetFirmware: 'v29.09.2020-HF123',
    }
];

export const UpdateHistoryDataMock = {
    content: [],
    empty: true,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    pageable: {
        offset: 0,
        pageNumber: 0,
        pageSize: 10,
        paged: true,
        sort: {
            empty: true,
            sorted: false,
            unsorted: true,
        },
        unpaged: false
    },
    size: 10,
    sort: {
        empty: true,
        sorted: false,
        unsorted: true,
    },
    totalElements: 0,
    totalPages: 0,
};

export const ConfigHistoryDataMock = {
    content: [],
    empty: true,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    pageable: {
        offset: 0,
        pageNumber: 0,
        pageSize: 10,
        paged: true,
        sort: {
            empty: true,
            sorted: false,
            unsorted: true,
        },
        unpaged: false
    },
    size: 10,
    sort: {
        empty: true,
        sorted: false,
        unsorted: true,
    },
    totalElements: 0,
    totalPages: 0,
};
