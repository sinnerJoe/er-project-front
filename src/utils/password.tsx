import sha1 from 'sha-1';

export function hashPassword(password: string):string {
    return sha1(password);
}