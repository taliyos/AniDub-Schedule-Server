export default interface ServerSettings {
    whitelist: string[];
    updateRate: number; // Miliseconds between checking for updates
    cert: string; // Location of the certificate
    key: string;  // Location of the key
}