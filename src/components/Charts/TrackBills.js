import React, {useState, useEffect} from 'react';
import Tree from 'react-d3-tree';
import '../styles/DepartmentHierarchy.css';
import web3 from '../../web3';
// import departmentABI from '../ABIs/DepartmentABI';
import departmentManagerABI from '../../ABIs/DepartmentManagerABI';
import DepartmentArrays from '../../CreatedContracts/DepartmentArrays';

import BillABI from '../../ABIs/BillABI';
import BillManager from '../../CreatedContracts/BillManager';

const TrackBills = (props) => {
  let rootNode = {};

  const [chartData, setChartData] = useState({
    name: '',
    attributes: {
    },
    children: [],
  });
  // const [data, setData] = useState(chartData);

  //root node not setting---------------------////////////////////@@@@@@@@@@@
  useEffect(()=>{
    console.log("Calling useEffect");
    getBillData(props.billAddress, true);
    console.log("Called useEffect");
  },[props.billAddress]);

  const dataMap = {
    "Dummy": true
  }


  const getBillData = async(billAddress, isRoot) => {
    console.log("getDepartmentData() Start "+billAddress);
    let contract = new web3.eth.Contract(BillABI, billAddress);
    await contract.methods.getBillStruct().call().then((response)=>{
      console.log("Data for "+billAddress);
      console.log(response);
      let newNode = {
        name: response?.name,
        attributes: {
          billOwnAddress: response?.billOwnAddress,
          amount: response?.amount,
        },
        children: [],
      };
      console.log("New Node defined");
      console.log(newNode);
      setChartData(newNode);
      console.log("TREE MODIFIED");
    }).catch(error=>{
      console.log("error: "+error);
    });
    console.log("getDepartmentData() End");
  }

  const addNode = (oldData, newNode, targetId, replace) => {
    console.log("Calling addNode, target = "+targetId);

    let newData = JSON.parse(JSON.stringify(oldData));

    let queue = [newData];
    while(queue.length>0) {
      let current = queue.pop();

      if (current.attributes?.billOwnAddress==targetId){
        if (replace){
          current.children = newNode;
        }
        else{
          current.children.push(newNode);
        }
        console.log("FOUND----------------------");
        break;
      }
      if (current.children){
        for (let i = 0; i<current.children.length; i++){
          queue.unshift(current.children[i]);
        }
    }
    }
    // console.log(newData);
    return newData;
  }

  const clicked = async(event) => {
    console.log("clicked");
    console.log(event);
    let billAddr = event.data.attributes.billOwnAddress;
    console.log("Address: "+billAddr);
    //----------
    // let contract = new web3.eth.Contract(departmentABI, depAddress);
    // await contract.methods.getSubDepartmentsPaginate(10, 0).call().then((response)=>{
      await BillManager.methods.getBillsFromMap(10, 0, billAddr).call().then((response)=>{
      // await DepartmentArrays.methods.getSubDepartments(10, 0, billAddr).call().then((response)=>{
      console.log("Data for "+billAddr);
      console.log(response);
      let newNodes = response.map((item)=>{
        return {
          name: item?.name,
          attributes: {
            billOwnAddress: item?.billOwnAddress,
            amount: item?.amount,
          },
          children: [],
      }
      });
      console.log("New Nodes defined");
      console.log(newNodes);
      let modifiedTree = addNode(chartData, newNodes, billAddr, true);
      // modifiedTree = newNode;
      // console.log("Modified Node");
      // console.log(modifiedTree);
      setChartData(modifiedTree);
      // console.log("TREE MODIFIED");
    }).catch(error=>{
      console.log("error: "+error);
    });
    console.log("getDepartmentData() End");
  }

  let translate = {x: 100, y: 100};
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" style={{ width: '60em', height: '50em' }}>
      <Tree data={chartData} 
      rootNodeClassName="node__root"
      branchNodeClassName="node__branch"
      leafNodeClassName="node__leaf"
      pathFunc="step"
      orientation="vertical"
      translate={translate}
      onNodeClick = {(event)=>clicked(event)}
      />
    </div>
  );
}

export default TrackBills;