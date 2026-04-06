// import { Client, Account, Databases, Storage } from 'appwrite'; // ⭐ Commented out to fix compilation error for frontend-only tests.

export const IS_APPWRITE_ENABLED = false;

// ⭐ MOCK CLASS DEFINITIONS for compilation stability
class MockClient {
    setEndpoint() { return this; }
    setProject() { return this; }
    subscribe() { return () => {}; }
}

class MockAccount {
    get() { throw new Error("Mock Mode: No real session"); }
    createEmailPasswordSession() { throw new Error("Mock Mode: No real login"); }
    deleteSession() { return Promise.resolve(); }
}

class MockDatabases {
    constructor(client) { this.client = client; }
    listDocuments() { return Promise.resolve({ documents: [] }); }
    createDocument() { return Promise.resolve({}); }
    updateDocument() { return Promise.resolve({}); }
}

class MockStorage {
    createFile() { return Promise.resolve({}); }
    getFileView() { return ""; }
}

const client = new MockClient();

export const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = 'citizen-voice-simulation';

export const account = new MockAccount();
export const databases = new MockDatabases(client);
export const storage = new MockStorage();

// Mock IDs and Query for compilation
export const ID = { unique: () => Date.now().toString() };
export const Query = { orderDesc: () => "" };

export default client;
