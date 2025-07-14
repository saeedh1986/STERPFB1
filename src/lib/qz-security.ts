
"use client";

import qz from 'qz-tray';
import { KJUR } from 'jsrsasign';

// Hashing algorithm - MUST MATCH the key generation algorithm
const ALGORITHM = "SHA256";

// Fetches the private key from the server
async function getPrivateKey(): Promise<string> {
    const response = await fetch('/security/private-key.pem');
    if (!response.ok) {
        throw new Error('Failed to fetch private key. Make sure you have run `npm run security:generate-cert`.');
    }
    return response.text();
}

// Signs the data with the private key
async function signData(data: string): Promise<string> {
    const privateKey = await getPrivateKey();
    const sig = new KJUR.crypto.Signature({ "alg": `${ALGORITHM}withRSA` });
    sig.init(privateKey);
    sig.updateString(data);
    const hex = sig.sign();
    
    // Convert hex to base64
    return btoa(hex.match(/\w{2}/g)!.map(a => String.fromCharCode(parseInt(a, 16))).join(""));
}

// Sets up the signature promise for QZ Tray
export function setupQzSecurity() {
    qz.security.setSignaturePromise(signData);
}
