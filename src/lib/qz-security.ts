
"use client";

import qz from 'qz-tray';
import { KJUR } from 'jsrsasign';

// Hashing algorithm
const ALGORITHM = "SHA512withRSA";

const CERTIFICATE = `
-----BEGIN CERTIFICATE-----
MIIECzCCAvOgAwIBAgIGAZgLBmIrMA0GCSqGSIb3DQEBCwUAMIGiMQswCQYDVQQG
EwJVUzELMAkGA1UECAwCTlkxEjAQBgNVBAcMCUNhbmFzdG90YTEbMBkGA1UECgwS
UVogSW5kdXN0cmllcywgTExDMRswGQYDVQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMx
HDAaBgkqhkiGw0BCQEWDXN1cHBvcnRAcXouaW8xGjAYBgNVBAMMEVFaIFRyYXkg
RGVtbyBDZXJ0MB4XDTI1MDcxMzIyMjAyNFoXDTQ1MDcxMzIyMjAyNFowgaIxCzAJ
BgNVBAYTAlVTMQswCQYDVQQIDAJOWTESMBAGA1UEBwwJQ2FuYXN0b3RhMRswGQYD
VQQKDBJRWiBJbmR1c3RyaWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMs
IExMQzEcMBoGCSqGSIb3DQEJARYNc3VwcG9ydEBxei5pbzEaMBgGA1UEAwwRUVog
VHJheSBEZW1vIENlcnQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDP
jrVZorKaT9DGzGHW250TR0fUzD9KHbhLA+VLKkAPQhzARlzJ4+mmXRGfrnRebSuu
f03Q/ePiMXdE5K+CVDQT7kVKVx3aTnJAnITUJOrq4uxl4A71mryTksdDwJv2aKE7
+THYbqoTdfN6tn4E+2U88HUV7WP9YqsganW1GSQi2F0IZN4g6L2rYT5J2tWQoKlX
yqnlp//jCOs51USfEpq36EsNkew1SWBYF+bodKTxWOhL/FjT2gg6t4559pzx1ReZ
oYaHdn+UfvJbvvIb83cHN/oSQ4uYr87GX2v6VJD9gwAUjRo/fxKVseaBVb3YUEg+
45x5I0Thft5c9XZb6ZqHAgMBAAGjRTBDMBIGA1UdEwEB/wQIMAYBAf8CAQEwDgYD
VR0PAQH/BAQDAgEGMB0GA1UdDgQWBBRwpbbFEWf1SO2l8Wbu1DtjH30H5jANBgkq
hkiGw0BAQsFAAOCAQEAXA5Q/P+r5Vzl1R9nlKa1eTmVw+2QHAWZtJTUyHsV0HCV
w2vzocYwMOiSP+dOrS4mmw66potPUBifB4r2NN5ExavuenbOqhTBNBPI4dOxZ6sk
mTpWgRbzjdHB70yaLKt/xNfplDLPWi4Y3vRAwOSV4+0MGMBARnUcTCDwRGBdwkc2
6OExlD446G42PidLfCZTqY/GEEYuzvhhajDPcOah45xaWBeQSXFofFkgd2KUdAif
YSQBaRCviiJDkhsCbwgMmg8ABnHmTlmYln+/AMSdbu4C4RUeWY+e/WdlKgvMxzAd
PXRWIxSCEmztSrWvbtChwIInGtNLN8rJgx2Oy8uTVw==
-----END CERTIFICATE-----
`.trim();

const PRIVATE_KEY = `
-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiGw0BAQEFAASCBKkwggSlAgEAAoIBAQDPjrVZorKaT9DG
zGHW250TR0fUzD9KHbhLA+VLKkAPQhzARlzJ4+mmXRGfrnRebSuuf03Q/ePiMXdE
5K+CVDQT7kVKVx3aTnJAnITUJOrq4uxl4A71mryTksdDwJv2aKE7+THYbqoTdfN6
tn4E+2U88HUV7WP9YqsganW1GSQi2F0IZN4g6L2rYT5J2tWQoKlXyqnlp//jCOs5
1USfEpq36EsNkew1SWBYF+bodKTxWOhL/FjT2gg6t4559pzx1ReZoYaHdn+UfvJb
vvIb83cHN/oSQ4uYr87GX2v6VJD9gwAUjRo/fxKVseaBVb3YUEg+45x5I0Thft5c
9XZb6ZqHAgMBAAECggEAX2gc6mgEKzSXJlqaerYWfN8eIK4GRZ5lsW3H/4YbTig4
qRVu34q5QzSyvjDl4uXR13NDJNcf4kCUr4FjP8hO6/5xsVtcKJY4pISN9ipGJdRL
kASvO6x2FGu61uT5jAnKW5QPmoo7+ZgVZInwYX/hqGJrn7mwZa/uM4dcNfOpja4M
hIjpXv+Hvu7xRZAHnkbxpka0hELf8uPKC3VLNdAH0sPaXX7FeBFV+2TjghrZjte8
bsI59tMQxQlEJ0fsE+oUdCu8PlLLArthQLk+OexCTh9xorJFf5OmpoVxtciIKccJ
z1WGo4pShucHsKUhM0jQBhS47hbM+ZCH0qvenRZt4QKBgQD4zhkXcut8VzhyQwqJ
jjPCstSw8ZVIDJ5HZ1zmu8JORGHjFANq4Cb3w8hzF5OhG7uUq+QjTlVYs+gRLYLj
pj3GZnuLd/od6VPIivW5S6Ed0nMtaTd3eolOzK0qTBeUZJXuCBeVD/mFOZK14Uj3
0G8zoMsfdw128xFVifYedGFhFwKBgQDVj0EuEx2Mqtuby+3RMeGr6/3x/m/wRjet
rXnQcGcVrOWzZkLOVWhyr4fCr2tqQQjKAXmmDPdrajTIeaKG/1iq15/E+qyUM4o8
/pgYiYejE0n/fDiuuvYaL44sIu3/uwBDJ6798MpTSHp4ORUCZYJeWLH8eodPh7WK
54xLyWgYEQKBgQCx50R/xNdnAELHSPKm6vxN0mtM3mEctJEUg28lOMo2BqVrpmrP
J9oVPXP9/7S69UaKhuJI8IEMPQ/KAJ3fw4XWcH8UecRpUOZsthf/13ksBsf+h4Z2
szKtGqMTZHdTzxx5qGWcW2DShxlFXgI72Fk7NFUpeYoyLJmPbWeD3TmoHwKBgQCj
d91HnGAxDZO+RLIMQCdixuiCdOVQQR9bdP9aWr+9arQEx5D5iYzCxLOhhU8ubQuC
PPDV9vTopsoyblDHDuvbEeP9DnhNlMoK+EKJ/bPyUtCAnKByty+sSZyFElOlPYns
3ZJoVQk6CK+eGOuJAxRwjWnoPg4XBWUkJytP06I3UQKBgQDzYwy67ttwdUz05cSL
PkdY5heZsUqAMsxZX8oXEIx3bud35nNFdpNy6fPOqri8BqfrdRrIe26UiGmlR+ST
DSYAeWh0rFpXNWxjhOeHDfBYktBV3rEoDmX09pXex+dWKKQFdO7wiqVhCkaQIxZt
JRyXUq7/xSDhPwjyHQMj2czy7Q==
-----END PRIVATE KEY-----
`.trim();


// Signs the data with the private key
function signData(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const sig = new KJUR.crypto.Signature({ "alg": ALGORITHM });
            sig.init(PRIVATE_KEY);
            sig.updateString(data);
            const hex = sig.sign();
            // Convert hex to base64
            const base64 = btoa(hex.match(/\w{2}/g)!.map(a => String.fromCharCode(parseInt(a, 16))).join(""));
            resolve(base64);
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

// Sets up the signature and certificate promises for QZ Tray
export function setupQzSecurity() {
    qz.security.setCertificatePromise((resolve) => {
        resolve(CERTIFICATE);
    });
    qz.security.setSignaturePromise(signData);
}
