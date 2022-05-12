import React, {useState, useEffect} from 'react';
import Tree from 'react-d3-tree';
import '../styles/DepartmentHierarchy.css';
import web3 from '../../web3';
import Popover from "react-bootstrap/Popover"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Button from "react-bootstrap/Button"
import Tooltip from "react-bootstrap/Tooltip"
// import { useCenteredTree } from "./helpers";
// import departmentABI from '../ABIs/DepartmentABI';
// import departmentManagerABI from '../../ABIs/DepartmentManagerABI';
// import DepartmentArrays from '../../CreatedContracts/DepartmentArrays';

import Pagination from '../Pagination';

import BillABI from '../../ABIs/BillABI';
import BillManager from '../../CreatedContracts/BillManager';
import AccountManagerAudit from '../../CreatedContracts/AccountManagerAudit';

const TrackBills = (props) => {

  const pageSize = 5;
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
    let size = 0;
    await AccountManagerAudit.methods.getBillLength(billAddress).call().then((res)=>{
      size = Math.ceil(res/pageSize);
    }).catch((err)=>{});

    let contract = new web3.eth.Contract(BillABI, billAddress);
    await contract.methods.getBillStruct().call().then((response)=>{
      console.log("Data for "+billAddress);
      console.log(response);
      let newNode = {
        name: response?.name,
        attributes: {
          billOwnAddress: response?.billOwnAddress,
          amount: response?.amount,
          size: size
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
    let size = 0;
    await AccountManagerAudit.methods.getBillLength(billAddr).call().then((res)=>{
      size = Math.ceil(res/pageSize);
    }).catch((err)=>{});
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
            size: size
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
  const renderTooltip = (props, msg) => (
    <Tooltip id="button-tooltip" {...props}>
      {msg}
    </Tooltip>
  );
  const nestedFunc = (item, args) => {
    console.log("Called nestedFunc()");
    console.log(item);
    console.log(args);
    clicked(args);
  }
  // const popover = () => (
  //   <Popover id="popover-basic">
  //     <Popover.Title as="h3">Popover right</Popover.Title>
  //     <Popover.Content>
  //       And here's some <strong>amazing</strong> content. It's very engaging.
  //       right?
  //     </Popover.Content>
  //   </Popover>
  // );
  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps
  }) => (
    <g>
      <circle  onClick={()=>clicked({data: nodeDatum})} r={15}></circle>
      {/* {console.log("nodeDatum")} */}
      {/* `foreignObject` requires width & height to be explicitly set. */}
      <foreignObject {...foreignObjectProps}>
      <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={(event)=>renderTooltip(event, "Amount: "+ nodeDatum.attributes.amount)}
          >
          <div style={{ border: "1px solid black", backgroundColor: "white" }}>
            <p style={{ textAlign: "center" }} onClick={toggleNode}>{nodeDatum.name}</p>
            {nodeDatum.children && (
              // <button style={{ width: "100%" }} onClick={()=>clicked({data: nodeDatum})}>
              //   Fetch
              // </button>
                <Pagination pageEnd={nodeDatum.attributes.size} pageTabs={3} function={(item)=>nestedFunc(item, {data: nodeDatum})}/>
            )}
          </div>
        </OverlayTrigger>
      </foreignObject>
    </g>
  );
  
  let translate = {x: 500, y: 100};
  const nodeSize = { x: 200, y: 200 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 20 };
  // const [translate, containerRef] = useCenteredTree();
  const containerStyles = {
    width: "100vw",
    height: "100vh"
  };
  const separation = { nonSiblings: 2, siblings: 2 };

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
      separation={separation}
      onNodeClick = {(event)=>clicked(event)}
      renderCustomNodeElement={(rd3tProps) =>
        renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
      }
      />
    </div>
  );
}

export default TrackBills;