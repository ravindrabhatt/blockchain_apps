pragma solidity ^0.4.17;

contract CampaignFactory{
	address[] public deployedContracts;

	function createCampaign(uint minimum) public {
		address newCampaign = new Campaign(minimum, msg.sender);
		deployedContracts.push(newCampaign);
	}

	function getDeployedContracts() public view returns(address[]){
		return deployedContracts;
	}
}

contract Campaign {
    struct Request{
      string description;
      uint value;
      bool completed;
      address receiver;
      uint approvalCount;
      mapping(address => bool) approvals;
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    Request[] public requests;
    
    function Campaign(uint minimum, address creator) public {
      manager = creator;
      minimumContribution = minimum;
    }
    
   function contribute() public payable {
     require(msg.value > minimumContribution);
     
     approvers[msg.sender] = true;
     approversCount++;
   }  
   
   function createSpendingRequest(
     string description, 
     uint value, 
     address receiver) public privileged {
     
     Request memory newRequest = Request({
         description: description,
         value: value,
         receiver: receiver,
         completed: false,
         approvalCount: 0
     });     
     
     requests.push(newRequest);
   }
   
   function approve(uint index) public contributor {
     Request storage request = requests[index];
     
     require(!requests[index].approvals[msg.sender]);
     
     request.approvals[msg.sender] = true;
     request.approvalCount++;
   }
   
   function finalizeRequest(uint index) public privileged {
     Request storage request = requests[index];

     require(request.approvalCount > (approversCount / 2));
     require(!request.completed);
     
     request.receiver.transfer(request.value);
     request.completed = true;
   }

   function summary() public view returns (uint, uint, uint, uint, address) {
     return (
       minimumContribution,
       this.balance,
       requests.length,
       approversCount,
       manager  
     );
   }
   
   function getRequestsCount() public view returns (uint) {
     return requests.length;
   }

   modifier privileged() {
     require(msg.sender == manager);
     _;
   }
   
   modifier contributor() {
     require(approvers[msg.sender]);
     _;
   }   
}