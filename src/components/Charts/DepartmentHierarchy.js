import React, {useState, useEffect} from 'react';
import Tree from 'react-d3-tree';
import '../styles/DepartmentHierarchy.css';
import web3 from '../../web3';
// import departmentABI from '../ABIs/DepartmentABI';
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip";
import Pagination from '../Pagination';

import departmentManagerABI from '../../ABIs/DepartmentManagerABI';
import DepartmentArrays from '../../CreatedContracts/DepartmentArrays';

import {DepartmentArrayType, pageSize} from '../Enums';

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
  // const pageSize = 5;

  const [pageNumberMap, setPageNumberMap] = useState(new Map());
  const [hoverItem, setHoverItem] = useState('');
  // const [data, setData] = useState(chartData);

  //root node not setting---------------------////////////////////@@@@@@@@@@@
  useEffect(()=>{
    console.log("Calling useEffect");
    let  rootElement = getDepartmentData(props.depAddress, true);
    
    setChartData(rootElement);
    console.log("Called useEffect");
  },[props.depAddress]);

  const dataMap = {
    "Dummy": true
  }

  const getDepartmentData = async(depAddress, isRoot) => {
    console.log("getDepartmentData() Start "+depAddress);
    let contract = new web3.eth.Contract(departmentManagerABI, depAddress);

    let depSize = 0;
    let empSize = 0;
    let audSize = 0;
    await contract.methods.getLength(DepartmentArrayType.SUBDEPARTMENTS).call().then((res)=>{
      depSize = Math.ceil(res/pageSize);
    }).catch((err)=>{});
    await contract.methods.getLength(DepartmentArrayType.EMPLOYEES).call().then((res)=>{
      empSize = Math.ceil(res/pageSize);
    }).catch((err)=>{});
    await contract.methods.getLength(DepartmentArrayType.AUDITORS).call().then((res)=>{
      audSize = Math.ceil(res/pageSize);
    }).catch((err)=>{});

    await contract.methods.getDepartmentStruct().call().then((response)=>{
      console.log("Data for "+depAddress);
      console.log(response);
      let newNode = {
        name: response?.name,
        attributes: {
          departmentAddress: response?.departmentAddress,
          balance: response?.balance,
          depSize: depSize,
          empSize: empSize,
          audSize: audSize,
          type: DepartmentArrayType.SUBDEPARTMENTS
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

  const clicked = async(event, pageNumber) => {
    console.log("clicked");
    console.log(event);
    let depAddress = event.data.attributes.departmentAddress;
    console.log("Address: "+depAddress);

    let depPageNumber = getPageNumber(depAddress, DepartmentArrayType.SUBDEPARTMENTS);
    let empPageNumber = getPageNumber(depAddress, DepartmentArrayType.EMPLOYEES);
    let audPageNumber = getPageNumber(depAddress, DepartmentArrayType.AUDITORS);

    console.log("depPageNumber: "+depPageNumber);
    console.log("empPageNumber: "+empPageNumber);
    console.log("audPageNumber: "+audPageNumber);

    let newNodes = [];
    if (depPageNumber!=undefined){
      await DepartmentArrays.methods.getSubDepartments(pageSize, depPageNumber, depAddress).call().then(async(response)=>{
      console.log("Subdepartments for "+depAddress);
      console.log(response);
      for (let i = 0; i<response.length; i++){
        let item = response[i];
        
        let depSize = 0;
        let empSize = 0;
        let audSize = 0;

        let contract = new web3.eth.Contract(departmentManagerABI, item.departmentAddress);

        await contract.methods.getLength(DepartmentArrayType.SUBDEPARTMENTS).call().then((res)=>{
          depSize = Math.ceil(res/pageSize);
        }).catch((err)=>{});
        await contract.methods.getLength(DepartmentArrayType.EMPLOYEES).call().then((res)=>{
          empSize = Math.ceil(res/pageSize);
        }).catch((err)=>{});
        await contract.methods.getLength(DepartmentArrayType.AUDITORS).call().then((res)=>{
          audSize = Math.ceil(res/pageSize);
        }).catch((err)=>{});

        newNodes.push(
        {
          name: item?.name,
          attributes: {
            departmentAddress: item?.departmentAddress,
            balance: item?.balance,
            depSize: depSize,
            empSize: empSize,
            audSize: audSize,
            type: DepartmentArrayType.SUBDEPARTMENTS
          },
          children: [],
        });
        }
        }).catch(error=>{
          console.log("error: "+error);
      });
    }
    //EMPLOYEES
    if (empPageNumber!=undefined){
      await DepartmentArrays.methods.getEmployees(pageSize, empPageNumber, depAddress).call().then(async(response)=>{
        console.log("employees for "+depAddress);
        console.log(response);
        for (let i = 0; i<response.length; i++){
          let item = response[i];
    
          newNodes.push(
          {
            name: item?.name,
            attributes: {
              departmentAddress: item?.employeeAddress,
              balance: item?.balance,
              depSize: 0,
              empSize: 0,
              audSize: 0,
              type: DepartmentArrayType.EMPLOYEES
            },
            children: [],
          });
        }
        console.log("New Nodes employee");
        console.log(newNodes);
        }).catch(error=>{
          console.log("error: "+error);
      });
    }
    //AUDITORS
    if (audPageNumber!=undefined){
      await DepartmentArrays.methods.getAuditors(pageSize, audPageNumber, depAddress).call().then(async(response)=>{
        console.log("auditors for "+depAddress);
        console.log(response);
        for (let i = 0; i<response.length; i++){
          let item = response[i];
    
          newNodes.push(
          {
            name: item?.name,
            attributes: {
              departmentAddress: item?.auditorAddress,
              balance: item?.balance,
              depSize: 0,
              empSize: 0,
              audSize: 0,
              type: DepartmentArrayType.AUDITORS
            },
            children: [],
          });
        }
        console.log("New Nodes auditor");
        console.log(newNodes);
        }).catch(error=>{
          console.log("error: "+error);
      });
    }

    let modifiedTree = addNode(chartData, newNodes, depAddress, true);
    // modifiedTree = newNode;
    // console.log("Modified Node");
    // console.log(modifiedTree);
    setChartData(modifiedTree);
    console.log("getDepartmentData() End");
  }
  const renderTooltip = (props, msg) => (
    <Tooltip id="button-tooltip" {...props}>
      {msg}
    </Tooltip>
  );
  const getPageNumber = (depAddress, ObjectType) => {
    // return pageNumberMap.get(depAddress);
    if (!pageNumberMap.has(depAddress))
      return undefined;
    return pageNumberMap.get(depAddress).get(ObjectType);
  }
  const setPageNumber = (depAddress, objectType, pageNumber) => {
    let copyOfPageNumberMap = pageNumberMap;
    if (!pageNumberMap.has(depAddress)){
      let localMap = new Map();
      // localMap.set(DepartmentArrayType.SUBDEPARTMENTS, 0);
      // localMap.set(DepartmentArrayType.EMPLOYEES, 0);
      // localMap.set(DepartmentArrayType.AUDITORS, 0);
      copyOfPageNumberMap.set(depAddress, localMap);
    }
    let localMap = pageNumberMap.get(depAddress);
    localMap.set(objectType, pageNumber);
    copyOfPageNumberMap.set(depAddress, localMap);
    setPageNumberMap(copyOfPageNumberMap);
  }
  const nestedFunc = (pNumber, args, objectType) => {
    // let pageMap = pageNumberMap;
    // pageMap.set(args.data.attributes.departmentAddress, pNumber);
    // setPageNumberMap(pageMap);
    setPageNumber(args.data.attributes.departmentAddress, objectType, pNumber);
    // console.log("pageNumberMap: ");
    // console.log(pageNumberMap);
    clicked(args, pNumber);
  }
  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps
  }) => (
    <g>
      {/* <circle r={15} style={{fill: "red"}}></circle> */}
      {nodeDatum.attributes?.type==DepartmentArrayType.SUBDEPARTMENTS && 
        <rect x="-20" y="-20" width="40" height="40" style={{fill:"yellow"}} />
      }
      {nodeDatum.attributes?.type==DepartmentArrayType.EMPLOYEES && 
        <polygon points="-25,0 0,25 25,0 0,-25" style={{fill:"blue"}} />
      }
      {nodeDatum.attributes?.type==DepartmentArrayType.AUDITORS && 
        <circle r={20} style={{fill: "red"}}/>
      }
      {/* <polygon points="0,0 25,25 0,50 -25,25" style={{fill:"lime",stroke:"purple"}} /> */}
      {/* {nodeDatum.__rd3t.depth==0 && <circle r={15} style={{fill: "red"}}></circle>}
      {nodeDatum.__rd3t.depth>0 && nodeDatum.attributes.size==0 && <circle r={15} style={{fill: "green"}}></circle>}
      {nodeDatum.__rd3t.depth>0 && nodeDatum.attributes.size>0 && <circle r={15} style={{fill: "yellow"}}></circle>} */}
      {/* {console.log("nodeDatum")} */}
      {/* {console.log(nodeDatum)} */}
      {/* {console.log(foreignObjectProps)}
      {console.log("----------------")} */}
      {/* `foreignObject` requires width & height to be explicitly set. */}
      <foreignObject {...foreignObjectProps} onMouseOver={()=>setHoverItem(nodeDatum.attributes.departmentAddress)} onMouseOut={()=>setHoverItem('')}>
      <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={(event)=>renderTooltip(event, "Address: "+nodeDatum.attributes?.departmentAddress)}
          >
          <div style={{ border: "1px solid black", backgroundColor: "white", borderRadius: '5px'}}>
            <p style={{ textAlign: "center" }} onClick={toggleNode}>{nodeDatum.name}</p>
            {/* {nodeDatum.attributes.billOwnAddress==hoverItem && */}
            <>
              {/* <p style={{ textAlign: "center" }} onClick={toggleNode}>Address: {nodeDatum.attributes?.departmentAddress}</p> */}
              {/* {getPageNumber(nodeDatum.attributes.billOwnAddress)} */}
              {nodeDatum.attributes?.depSize>0 && nodeDatum.attributes.departmentAddress==hoverItem && (
                <div class="d-flex justify-content-center">
                  <div class="row-md-1">
                  Departments: 
                   <Pagination activePage={getPageNumber(nodeDatum.attributes.departmentAddress, DepartmentArrayType.SUBDEPARTMENTS)} pageEnd={nodeDatum.attributes.depSize} pageTabs={3} function={(item)=>nestedFunc(item, {data: nodeDatum}, DepartmentArrayType.SUBDEPARTMENTS)}/>
                  </div>
                </div>
              )}
              {nodeDatum.attributes?.empSize>0 && nodeDatum.attributes.departmentAddress==hoverItem && (
                <div class="d-flex justify-content-center">
                  <div class="row-md-1">
                  Employees: 
                  <Pagination activePage={getPageNumber(nodeDatum.attributes.departmentAddress, DepartmentArrayType.EMPLOYEES)} pageEnd={nodeDatum.attributes.empSize} pageTabs={3} function={(item)=>nestedFunc(item, {data: nodeDatum}, DepartmentArrayType.EMPLOYEES)}/>
                  </div>
                </div>
              )}
              {nodeDatum.attributes?.audSize>0 && nodeDatum.attributes.departmentAddress==hoverItem && (
                <div class="d-flex justify-content-center">
                  <div class="row-md-1">
                  Auditors: 
                  <Pagination activePage={getPageNumber(nodeDatum.attributes.departmentAddress, DepartmentArrayType.AUDITORS)} pageEnd={nodeDatum.attributes.audSize} pageTabs={3} function={(item)=>nestedFunc(item, {data: nodeDatum}, DepartmentArrayType.AUDITORS)}/>
                  </div>
                </div>
              )}
            </>
          {/* } */}
          </div>
        </OverlayTrigger>
      </foreignObject>
    </g>
  );

  let translate = {x: 500, y: 100};
  const nodeSize = { x: 200, y: 300 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 20 };
  // const [translate, containerRef] = useCenteredTree();
  const containerStyles = {
    width: "100vw",
    height: "100vh"
  };
  const separation = { nonSiblings: 2, siblings: 2 };
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    // <div id="treeWrapper" style={{ width: '60em', height: '50em' }}>
    //   <Tree data={chartData} 
    //   rootNodeClassName="node__root"
    //   branchNodeClassName="node__branch"
    //   leafNodeClassName="node__leaf"
    //   pathFunc="step"
    //   orientation="vertical"
    //   translate={translate}
    //   onNodeClick = {(event)=>clicked(event)}
    //   />
    // </div>
    <div id="treeWrapper" style={{ width: '75em', height: '50em' }}>
      {chartData && 
        <Tree data={chartData} 
        // rootNodeClassName="node__root"
        // branchNodeClassName="node__branch"
        // leafNodeClassName="node__leaf"
        pathFunc="step"
        orientation="vertical"
        translate={translate}
        separation={separation}
        onNodeClick = {(event)=>clicked(event)}
        depthFactor= {200}
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
        }
        />
      }
    </div>
  );
}
export default DepartmentHierarchy;