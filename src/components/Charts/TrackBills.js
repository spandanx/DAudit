import React, {useState, useEffect} from 'react';
import Tree from 'react-d3-tree';
import '../styles/DepartmentHierarchy.css';
import web3 from '../../web3';
import Popover from "react-bootstrap/Popover"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Button from "react-bootstrap/Button"
import Tooltip from "react-bootstrap/Tooltip";
// import ReactCSSTransitionGroup from 'react-transition-group';
// import departmentABI from '../ABIs/DepartmentABI';
// import departmentManagerABI from '../../ABIs/DepartmentManagerABI';
// import DepartmentArrays from '../../CreatedContracts/DepartmentArrays';
import { TiTick } from "react-icons/ti";
import { BsExclamation } from "react-icons/bs";
import Pagination from '../Pagination';

import { StatusReverse, tokenName, pageSize } from '../Enums';

import BillABI from '../../ABIs/BillABI';
import BillManager from '../../CreatedContracts/BillManager';
import AccountManagerAudit from '../../CreatedContracts/AccountManagerAudit';

const TrackBills = (props) => {

  // const pageSize = 5;
  // let rootNode = {};
  const [pageNumberMap, setPageNumberMap] = useState(new Map());

  const [chartData, setChartData] = useState({
    name: '',
    attributes: {
    },
    children: [],
  });
  const [hoverItem, setHoverItem] = useState('');
  const [executingBillAddress, setExecutingBillAddress] = useState('');
  const [search_billAddress, setSearch_billAddress] = useState('');
  const [search_error, setSearch_error] = useState('EMPTY');
  const address0 = "0x0000000000000000000000000000000000000000";

  const borderColor = {0:'blue', 1:'green', 2:'red'};
  // const [data, setData] = useState(chartData);

  //root node not setting---------------------////////////////////@@@@@@@@@@@
  useEffect(()=>{
    checkAddressValidity(search_billAddress);
  },[search_billAddress]);

  useEffect(()=>{
    if (!search_error){
      setExecutingBillAddress(search_billAddress);
    }
  },[search_error]);

  useEffect(()=>{
    if (props.billAddress){
      setExecutingBillAddress(props.billAddress);
    }
  },[props.billAddress]);

  useEffect(()=>{
    if (executingBillAddress){
      getBillData(executingBillAddress, true);
    }
  },[executingBillAddress]);

  const dataMap = {
    "Dummy": true
  }

  const checkAddressValidity = async(address) => {
    console.log("checkAddressValidity() called");
    try{
      await AccountManagerAudit.methods.bills(address).call().then((res)=>{
        console.log("fetched: "+res);
        if (res==address0){
          console.log("Not found");
          setSearch_error("Bill not found!");
        }
        else{
          console.log("found");
          setSearch_error("");
        }
      }).catch((err)=>{});
    }
    catch(err){
      setSearch_error("Invalid address");
    }
    console.log("checkAddressValidity() exit");
  }

  const getBillData = async(billAddress, isRoot) => {
    console.log("getDepartmentData() Start "+billAddress);
    let size = 0;
    await AccountManagerAudit.methods.getBillLength(billAddress).call().then((res)=>{
      console.log("Size of nested bill for "+billAddress+" = "+res);
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
          status: response?.status,
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

  const clicked = async(event, pageNumber) => {
    console.log("clicked");
    console.log(event);
    let billAddr = event.data.attributes.billOwnAddress;
    console.log("Address: "+billAddr);
    //----------
    // let contract = new web3.eth.Contract(departmentABI, depAddress);
    // await contract.methods.getSubDepartmentsPaginate(10, 0).call().then((response)=>{
      await BillManager.methods.getBillsFromMap(pageSize, pageNumber, billAddr).call().then(async(response)=>{
      // await DepartmentArrays.methods.getSubDepartments(10, 0, billAddr).call().then((response)=>{
      console.log("Data for "+billAddr);
      console.log(response);
      let item;
      let newNodes = [];
      for (let i = 0; i< response.length; i++){
        // let newNodes = response.map((item)=>{
          let size = 0;
          item = response[i];
          await AccountManagerAudit.methods.getBillLength(item.billOwnAddress).call().then((res)=>{
            console.log("Size of nested bill for "+item.billOwnAddress+" = "+res);
            size = Math.ceil(res/pageSize);
          }).catch((err)=>{});
          newNodes.push({
            name: item?.name,
            attributes: {
              billOwnAddress: item?.billOwnAddress,
              amount: item?.amount,
              status: item?.status,
              size: size
            },
            children: [],
          });
        }
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
    // console.log("Called nestedFunc()");
    // console.log(item);
    // console.log(args);
    let pageMap = pageNumberMap;
    pageMap.set(args.data.attributes.billOwnAddress, item);
    setPageNumberMap(pageMap);
    // console.log("pageNumberMap: ");
    // console.log(pageNumberMap);
    clicked(args, item);
  }
  const getPageNumber = (billAddress) => {
    // console.log("Calling getPageNumber() for bill: "+billAddress);
    // console.log(pageNumberMap);
    // if (pageNumberMap.has(billAddress)){
    //   console.log("PAGENUMBER: "+pageNumberMap.get(billAddress));
    //   return pageNumberMap.get(billAddress);
    // }
    // else{
    //   console.log("PAGENUMBER: -1");
    //   return -1;
    // }
    // console.log("PAGENUMBER: "+pageNumberMap.get(billAddress));
    return pageNumberMap.get(billAddress);
  }
  const searchBar = () => {
    return(
      <nav class="navbar navbar-light bg-light">
        <form class="container-fluid">
          <div class="input-group">
            <input type="text" class="form-control me-2" placeholder="Bill address" aria-label="Username" aria-describedby="basic-addon1"
            value={search_billAddress} 
            onChange={(event) => setSearch_billAddress(event.target.value)}
            />
            <div class="py-1 me-2">
                {!search_error && 
                  <div title={"Valid"} data-toggle="popover" data-trigger="hover" data-content="Some content"><TiTick color='green'/></div>
                }
                {search_error && 
                  <div title={search_error} data-toggle="popover" data-trigger="hover" data-content="Some content"><BsExclamation color='red'/></div>
                }
            </div>
            {/* <button class="btn btn-outline-success" type="submit" disabled={search_error}>Search</button> */}
          </div>
        </form>
      </nav>
    );
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
      {nodeDatum.__rd3t.depth==0 && <circle r={15} style={{fill: "red"}}></circle>}
      {nodeDatum.__rd3t.depth>0 && nodeDatum.attributes.size==0 && <circle r={15} style={{fill: "green"}}></circle>}
      {nodeDatum.__rd3t.depth>0 && nodeDatum.attributes.size>0 && <circle r={15} style={{fill: "yellow"}}></circle>}
      {/* {console.log("nodeDatum")} */}
      {/* {console.log(nodeDatum)}
      {console.log(foreignObjectProps)}
      {console.log("----------------")} */}
      {/* `foreignObject` requires width & height to be explicitly set. */}
      <foreignObject {...foreignObjectProps} onMouseOver={()=>setHoverItem(nodeDatum.attributes.billOwnAddress)} onMouseOut={()=>setHoverItem('')}>
      <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={(event)=>renderTooltip(event, StatusReverse[nodeDatum.attributes.status])}
          >
          <div style={{ border: "1px solid "+borderColor[nodeDatum.attributes.status], backgroundColor: "white", borderRadius: '5px'}}>
            <p style={{ textAlign: "center" }} onClick={toggleNode}>{nodeDatum.name}</p>
            {nodeDatum.attributes.billOwnAddress==hoverItem &&
            <>
              <p style={{ textAlign: "center" }} onClick={toggleNode}>Amount: {nodeDatum.attributes.amount +" "+ tokenName}</p>
            
              {nodeDatum.attributes.size>0 && (
                // <button style={{ width: "100%" }} onClick={()=>clicked({data: nodeDatum})}>
                //   Fetch
                // </button>
                <div class="d-flex justify-content-center">
                  <Pagination activePage={getPageNumber(nodeDatum.attributes.billOwnAddress)} pageEnd={nodeDatum.attributes.size} pageTabs={3} function={(item)=>nestedFunc(item, {data: nodeDatum})}/>
                </div>
              )}
            </>
          }
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
    <div>
      {searchBar()}
      {executingBillAddress && 
        <div id="treeWrapper" style={{ width: '75em', height: '50em' }}>
          <Tree data={chartData} 
          // rootNodeClassName="node__root"
          // branchNodeClassName="node__branch"
          // leafNodeClassName="node__leaf"
          pathFunc="diagonal"
          orientation="vertical"
          translate={translate}
          separation={separation}
          onNodeClick = {(event)=>clicked(event)}
          renderCustomNodeElement={(rd3tProps) =>
            renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
          }
          />
        </div>
      }
    </div>
  );
}

export default TrackBills;