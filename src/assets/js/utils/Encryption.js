import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_API_SECRET; // put in .env

export const encryptPayload = (data) => {
    return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        SECRET_KEY
    ).toString();
};