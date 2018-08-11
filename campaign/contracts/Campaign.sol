pragma solidity ^0.4.17;

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
    
    function Constructor(uint minimum) public {
        manager = msg.sender;
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
       
       require(request.completed == false);
       require(request.approvalCount > (approversCount / 2));
       
       request.receiver.transfer(request.value);
       request.completed = true;
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