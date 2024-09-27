import { create } from 'ipfs-http-client';

const projectId = import.meta.env.VITE_INFURA_IPFS_PROJECT_ID;
const projectSecret = import.meta.env.VITE_INFURA_IPFS_PROJECT_SECRET;
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfsClient = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers:{
      authorization
    }
  })

export default ipfsClient;