export const DashboardKipMock = [
    {
        apps: [
            {
                packageName: 'mdc-apps',
                packageVersion: 'mdc-apps-3.0.1-r2',
                releaseDate: 0,
                systemPackage: true,
                installedOn: 0,
                available: false
            }
        ],
        certificate_id: 'adde3596efc63b6ff17a8533e9279c15f69f4b3204094a2e6f83e0194cd398a0',
        enrolled_on: 0,
        macid: '189ba5405bd2',
        serial: '189ba5405bd2',
        status: 0,
        lastSeen: 0,
        uptime: 0,
        presence: 'booting',
        certificate: {
            certificateId: 'adde3596efc63b6ff17a8533e9279c15f69f4b3204094a2e6f83e0194cd398a0',
            certificateFileLocation: 'device_madhukarhyd0/starpointcertandcacert.crt',
            keyFileLocation: 'device_madhukarhyd0/starpointcert.key',
            s3BucketName: 'mdc.certificates',
            certificateSignatureLocation: 'device_madhukarhyd0/starpointcertandcacert.crt.sign',
            keySignatureLocation: 'device_madhukarhyd0/starpointcert.key.sign',
            certificateCheckSum: '574026e188a296fdb90e8e3945118a57',
            keyCheckSum: '429e22b883cc696be1cf5da940b4b5bb',
            issuedOn: 1602074780000,
            expiresOn: 4755674780000,
            country: 'GB',
            state: 'London',
            locality: 'London',
            organisation: 'Proterra',
            orgUnit: 'IT Department',
            commonName: 'sandeep'
        },
        dispensers: [

        ],
        firmware: {
            firmwareVersion: 'v04.10.2020-HF123',
            releaseDate: 0,
            installedOn: 1602084097380,
            available: false
        }
    },
    {
        apps: [
            {
                id: '569f8013-4a0d-41ad-b481-b999d2dc7e9c',
                packageName: 'mdc-apps',
                packageVersion: '3.0.8-r1',
                targetFirmware: 'v07.10.2020-HF123',
                releaseDate: 1602046793693,
                systemPackage: true,
                changeLog: '### mdc-apps v3.0.8  2020-10-07\n\n#### Added\n+ Added MDS FOTA support.',
                operation: 'update',
                installedOn: 1602141912166,
                jobId: '189ba5405bcc_software_update_2020-10-08T07-25-09-569Z',
                status: 'Completed',
                s3BucketName: 'mdc-builds',
                packageLocation: 'platform_daily/SOTA_intermittent_builds/v3.0.8-r1/mdc-apps-3.0.8-r1.cortexa5t2hf_neon_vfpv4.rpm',
                fileSize: '576KB',
                checkSum: '886cab09a2eb862954075337bf17d86b',
                signatureLocation: 'platform_daily/SOTA_intermittent_builds/v3.0.8-r1/mdc-apps-3.0.8-r1.cortexa5t2hf_neon_vfpv4.rpm.signed',
                available: true
            }
        ],
        certificate_id: '13381404c22fb94b22060b5e3f73da587b428ed4a96c49ba93c9dcf9de8b3b44',
        enrolled_on: 0,
        firmwareUpdateRequest: {
            firmwareVersion: 'v09.10.2020-HF123',
            releaseDate: 1602138677802,
            changeLog: '### Platform v09.10.2020-HF123  2020-10-08\n\n#### Added\n+ Implemented support for FOTA feature in platform.',
            packageLocation: 'platform_daily/FOTA_intermittent_builds/v09.10.2020-HF123/sp-dvt-image-sama5d27',
            signatureLocation: 'platform_daily/FOTA_intermittent_builds/v09.10.2020-HF123/sp-dvt-image',
            status: 'IN_PROGRESS',
            s3BucketName: 'mdc-builds',
            fileSize: '68MB',
            checkSum: '48b910ef176258fd7094f200c2248cf4',
            installedOn: 1602142513337,
            jobId: '189ba5405bcc_firmware_update_2020-10-08T07-35-10-777Z',
            available: true
        },
        macid: '189ba5405bcc',
        serial: '189ba5405bcc',
        status: 0,
        lastSeen: 1602142852,
        uptime: 851,
        presence: 'booting',
        alias: 'sourav_device',
        certificate: {
            certificateId: '13381404c22fb94b22060b5e3f73da587b428ed4a96c49ba93c9dcf9de8b3b44',
            certificateFileLocation: 'device_souravhyd_bcc0/starpointcertandcacert.crt',
            keyFileLocation: 'device_souravhyd_bcc0/starpointcert.key',
            s3BucketName: 'mdc.certificates',
            certificateSignatureLocation: 'device_souravhyd_bcc0/starpointcertandcacert.crt.sign',
            keySignatureLocation: 'device_souravhyd_bcc0/starpointcert.key.sign',
            certificateCheckSum: 'fc3227a42ca3fd5f52ae9076c4691b67',
            keyCheckSum: 'cd012b56b0f05040f81639e3c9b1dcbe',
            issuedOn: 1602076206000,
            expiresOn: 4755676206000,
            country: 'GB',
            state: 'London',
            locality: 'London',
            organisation: 'Proterra',
            orgUnit: 'IT Department',
            commonName: 'sandeep'
        },
        dispensers: [],
        firmware: {
            firmwareVersion: 'v07.10.2020-HF123',
            releaseDate: 1602074647077,
            changeLog: '### Platform v07.10.2020-HF123  2020-10-07\n\n#### Added\n+ Implemented support for FOTA feature in platform.',
            packageLocation: 'platform_daily/FOTA_intermittent_builds/v07.10.2020-HF123',
            signatureLocation: 'platform_daily/FOTA_intermittent_builds/v07.10.2020-HF123',
            status: 'Completed',
            s3BucketName: 'mdc-builds',
            fileSize: '68MB',
            checkSum: 'eef15c9a56d70255f679912ec9b8cf36',
            installedOn: 1602140645876,
            jobId: '189ba5405bcc_firmware_update_2020-10-08T07-04-03-488Z',
            available: true
        }
    }
];
