import * as fs from 'fs';
import * as path from 'path';

export interface Address {
    id: number;
    address: string;
    snappAddressType: string | null;
    city: {
        id: number;
        title: string | null;
        latitude: number | null;
        longitude: number | null;
        isFavorite: boolean | null;
        isExpress: boolean | null;
    };
    label: string | null;
    phone: string;
    latitude: number;
    longitude: number;
    isCompany: boolean;
    companyDiscount: number;
    isConfirmed: boolean;
    status: number;
    statusCode: number;
    client: string;
    addressExtra: string;
}

interface Database {
    auth_token: string;
    address: Address[];
}

const dbFilePath = path.join(__dirname, 'database.json');

export class JsonDatabase {
    private data: Database;

    constructor() {
        if (fs.existsSync(dbFilePath)) {
            const rawData = fs.readFileSync(dbFilePath, 'utf-8');
            this.data = JSON.parse(rawData);
        } else {
            this.data = { auth_token: '', address: [] };
            this.save();
        }
    }

    private save() {
        fs.writeFileSync(dbFilePath, JSON.stringify(this.data, null, 2));
    }

    public getAuthToken(): string {
        return this.data.auth_token;
    }

    public setAuthToken(token: string): void {
        this.data.auth_token = token;
        this.save();
    }

    public getAddresses(): Address[] {
        return this.data.address;
    }

    public addAddress(address: Address): void {
        const isDuplicate = this.data.address.some(
            (addr) => addr.id === address.id
        );
        if (!isDuplicate) {
            this.data.address.push(address);
            this.save();
        }
    }

    public addAddresses(addresses: Address[]): void {
        addresses.forEach((address) => {
            try {
                this.addAddress(address);
            } catch (error) {
                console.error(error);
            }
        });
    }

    public updateAddress(index: number, address: Address): void {
        if (index >= 0 && index < this.data.address.length) {
            this.data.address[index] = address;
            this.save();
        } else {
            throw new Error('Address index out of bounds');
        }
    }

    public removeAddress(index: number): void {
        if (index >= 0 && index < this.data.address.length) {
            this.data.address.splice(index, 1);
            this.save();
        } else {
            throw new Error('Address index out of bounds');
        }
    }

    public read(): Database {
        return this.data;
    }
}
