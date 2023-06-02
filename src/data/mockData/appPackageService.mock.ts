import { of } from 'rxjs';

export class AppPackageServiceStub {
    fectAll() {
        return of({
            data: [
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
                    targetVersionCode: 1,
                }
            ],
        });
    }

}
export const appPackagesMock =
    [
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
            targetVersionCode: 1,
        }
    ];
export class DeviceServiceStub {
    getDeviceDetails(macId: any) {
        return of({
            data: {
                alias: 'Device-67',
                apps: [],
                assembly_serial: 'MDC_GV_001',
                certificate_id: 'LVHzMbp6rPcbbElyX5S26oPjNKX0B8IR8EvItIhmOIMDVeysyp4l43qyXXOOrH1i',
                cradlepoint_id: 'CP-70000000067',
                cradlepoint_mac: 'C6B72B08740D',
                customer: 'Customer5',
                dispensers: [],
                enrolled_on: 1599239303335,
                group: 'TEST_GRP',
                macid: 'C4E30CE0D53D',
                model: 'SP60',
                pcs: 'Proterra-PCS-60',
                serial: 'C4E30CE0D53D',
                simiccid: 'C2F8C4218C0D',
                status: 0,
                uptime: 0,
                vendor: 'Proterra',
            }
        });
    }
}
