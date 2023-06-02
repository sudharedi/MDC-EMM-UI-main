import { Observable } from 'rxjs';
import { of } from 'rxjs';

export class DeviceServiceStub {

    constructor() { }

    getDeviceDetails() { return of({ DeviceData }); }

}

export const DeviceData = {
    alias: 'Proterra10',
    apps: [],
    assembly_serial: 'MDC_GV_001',
    certificate_id: '9i74KBnuEtYIOietJTynGLr3bo6cUvIyk4OiSdLxgZaEJx8vdLyiGgm5qFtAZBkG',
    cradlepoint_id: 'CP-70000000056',
    cradlepoint_mac: 'AC5651EA0892',
    customer: 'Customer5',
    dispensers: [],
    enrolled_on: 1597309494574,
    firmwares: [],
    group: 'TEST',
    macid: 'F1238AE4191E',
    model: 'SP60',
    pcs: 'Proterra-PCS-60',
    serial: 'F1238AE4191E',
    simiccid: 'D8E444B3C033',
    status: 0,
    uptime: 0,
    vendor: 'Proterra',
};

export const ConfigValues = [
    {
        advanceParam: false,
        boolValue: false,
        description: 'Charging Sequence',
        disabled: true,
        displayName: null,
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
        disabled: true,
        displayName: null,
        intValue: 90,
        maximum: 110,
        minimum: 1,
        name: 'd1_bulk_soc',
        strValue: null,
        type: 'number',
        unit: '%',
    },
    {
        advanceParam: false,
        boolValue: false,
        description: 'Top Charge Limit for Dispenser in Slot 2',
        disabled: true,
        displayName: null,
        intValue: 100,
        maximum: 110,
        minimum: 1,
        name: 'd2_top_soc',
        strValue: null,
        type: 'number',
        unit: '%',
    }
];

export const SoftwarePackages = [
    {
        changeLog: 'Lorem ipsum dolor sit amet',
        fileSize: '240MB',
        id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c',
        installedOn: 0,
        packageLocation: 'Edmonton',
        packageName: 'other_app3',
        packageVersion: '1.0.3_r1',
        packageVersionCode: 5,
        releaseDate: 2344444444,
        systemPackage: false,
        targetVersionCode: 4
    },
    {
        changeLog: 'v2.0.0 2020-08-25 Added',
        checkSum: '3b0ace581a071a4f33c88fc3aa7f7676',
        fileSize: '540KB',
        id: '9acdef99-5a76-4a1f-abef-7fc6859af321',
        installedOn: 0,
        packageLocation: 'platform_daily/test/mdc-apps-2.0.0-r1.cortexa5t2hf_neon_vfpv4.rpm',
        packageName: 'mdc-apps',
        packageVersion: '2.0.0-r1',
        packageVersionCode: 2,
        releaseDate: 1599049271929,
        s3BucketName: 'mdc-builds',
        signatureLocation: 'platform_daily/test/mdc-apps-2.0.0-r1.cortexa5t2hf_neon_vfpv4.rpm.sign',
        systemPackage: true,
        targetVersionCode: 1
    },
    {
        changeLog: 'this is userpackage created by QA ',
        checkSum: '54f64fcc64bef74e8b754455fc495964',
        fileSize: '400',
        id: '108cf45e-4044-49c5-8f63-e580c807cb6e',
        installedOn: 0,
        packageLocation: 'platform_daily/10_20200824154556/test-mode-1.0-r1.cortexa5t2hf_neon_vfpv4.rpm',
        packageName: 'test-mode',
        packageVersion: '1.0-r1',
        packageVersionCode: 2,
        releaseDate: 1598344170309,
        s3BucketName: 'mdc-builds',
        systemPackage: false,
        targetVersionCode: 1
    },
    {
        id: 'b9d87d15-df9f-4dc3-b291-a2c96ec6f649',
        installedOn: 0,
        packageLocation: 's3://mdc_packages/package4.rpm',
        packageName: 'other_app1',
        packageVersion: '1.0.1_r4',
        packageVersionCode: 4,
        releaseDate: 2344444444,
        systemPackage: false,
        targetVersionCode: 3
    }
];
