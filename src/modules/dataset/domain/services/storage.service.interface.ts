import { Multer } from 'multer';

export interface IStorageService {
    uploadFile(file: Multer['File'], path: string): Promise<string>;
    listFiles(prefix: string): Promise<any[]>;
    getFileUrl(path: string, expiryInSeconds?: number): Promise<string>;
    deleteFile(path: string): Promise<void>;
} 