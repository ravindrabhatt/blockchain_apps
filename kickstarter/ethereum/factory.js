import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const address = '0x8B9f19517D10AC6C41C0DBFE99D850d6b153C70f';

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	address
);

export default instance;