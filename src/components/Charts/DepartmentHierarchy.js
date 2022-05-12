import React, {useState, useEffect} from 'react';
import Tree from 'react-d3-tree';
import '../styles/DepartmentHierarchy.css';
import web3 from '../../web3';
// import departmentABI from '../ABIs/DepartmentABI';
import departmentManagerABI from '../../ABIs/DepartmentManagerABI';
import DepartmentArrays from '../../CreatedContracts/DepartmentArrays';

// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.

const DepartmentHierarchy = (props) => {

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
    let  rootElement = getDepartmentData(props.depAddress, true);
    
    setChartData(rootElement);
    // console.log("RootElement");
    // console.log(rootElement);
    console.log("Called useEffect");
  },[props.depAddress]);

  const dataMap = {
    "Dummy": true
  }


  const getDepartmentData = async(depAddress, isRoot) => {
    console.log("getDepartmentData() Start "+depAddress);
    let contract = new web3.eth.Contract(departmentManagerABI, depAddress);
    await contract.methods.getDepartmentStruct().call().then((response)=>{
      console.log("Data for "+depAddress);
      console.log(response);
      let newNode = {
        name: response?.name,
        attributes: {
          departmentAddress: response?.departmentAddress,
          balance: response?.balance,
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

  // let chartData = {
  //   name: 'CEO',
  //   attributes: {
  //     id: 'root',
  //   },
  //   children: [
  //     {
  //       name: 'Manager1',
  //       attributes: {
  //         id: 'm1',
  //       },
  //       children:[],
  //     },
  //     {
  //       name: 'Manager2',
  //       attributes: {
  //         id: 'm2',
  //       },
  //       children:[],
  //     },
  //   ],
  // };
  //getSubDepartmentsPaginate

  const addNode = (oldData, newNode, targetId, replace) => {
    console.log("Calling addNode, target = "+targetId);

    let newData = JSON.parse(JSON.stringify(oldData));

    let queue = [newData];
    while(queue.length>0) {
      let current = queue.pop();

      if (current.attributes?.departmentAddress==targetId){
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
    let depAddress = event.data.attributes.departmentAddress;
    console.log("Address: "+depAddress);
    // if ((depAddress in dataMap)){
    //   console.log("ALREADY CLICKED");
    //   return;
    // }
    // dataMap[depAddress] = true;
    // console.log("FIRST TIME CLICKED");
    //----------
    // let contract = new web3.eth.Contract(departmentABI, depAddress);
    // await contract.methods.getSubDepartmentsPaginate(10, 0).call().then((response)=>{
      await DepartmentArrays.methods.getSubDepartments(10, 0, depAddress).call().then((response)=>{
      console.log("Data for "+depAddress);
      console.log(response);
      let newNodes = response.map((item)=>{
        return {
        name: item?.name,
        attributes: {
          departmentAddress: item?.departmentAddress,
          balance: item?.balance,
        },
        children: [],
      }
      });
      console.log("New Nodes defined");
      console.log(newNodes);
      let modifiedTree = addNode(chartData, newNodes, depAddress, true);
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
export default DepartmentHierarchy;