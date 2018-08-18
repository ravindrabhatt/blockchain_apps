import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const address = '0x0947d87f4581f5dBb202898881F45f6b194dcfd1';

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	address
);

export default instance;