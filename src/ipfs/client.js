import { create } from 'ipfs-http-client';
import { getConfig } from '../configs/getConfig';

const client = create({ 
    url: getConfig().ipfsEndpoint, 
});

export default client;