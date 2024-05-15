import { create } from 'ipfs-http-client';

const client = create({ 
    url: import.meta.env.VITE_IPFS_ENDPOINT, 
});

export default client;