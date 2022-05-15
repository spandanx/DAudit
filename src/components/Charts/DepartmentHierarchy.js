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

import {DepartmentArrayType} from '../Enums';

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
  const pageSize = 5;
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

    let size = 0;
    await contract.methods.getLength(DepartmentArrayType.SUBDEPARTMENTS).call().then((res)=>{
      size = res;
    }).catch((err)=>{});

    await contract.methods.getDepartmentStruct().call().then((response)=>{
      console.log("Data for "+depAddress);
      console.log(response);
      let newNode = {
        name: response?.name,
        attributes: {
          departmentAddress: response?.departmentAddress,
          balance: response?.balance,
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

      await DepartmentArrays.methods.getSubDepartments(pageSize, pageNumber, depAddress).call().then(async(response)=>{
      console.log("Data for "+depAddress);
      console.log(response);
      let newNodes = [];
      for (let i = 0; i<response.length; i++){
        let item = response[i];
        let size = 0;
        let contract = new web3.eth.Contract(departmentManagerABI, item.departmentAddress);
        await contract.methods.getLength(DepartmentArrayType.SUBDEPARTMENTS).call().then((res)=>{
          size = res;
        }).catch((err)=>{});

        newNodes.push(
        {
          name: item?.name,
          attributes: {
            departmentAddress: item?.departmentAddress,
            balance: item?.balance,
            size: size
          },
          children: [],
        });
      }
      // let newNodes = response.map((item)=>{
        // return {
          
      // }
      // );
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
  const renderTooltip = (props, msg) => (
    <Tooltip id="button-tooltip" {...props}>
      {msg}
    </Tooltip>
  );
  const getPageNumber = (billAddress) => {
    return pageNumberMap.get(billAddress);
  }
  const nestedFunc = (pNumber, args) => {
    let pageMap = pageNumberMap;
    pageMap.set(args.data.attributes.departmentAddress, pNumber);
    setPageNumberMap(pageMap);
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
      <rect x="-20" y="-20" width="40" height="40" style={{fill:"red"}} />
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
              {nodeDatum.attributes?.size>0 && nodeDatum.attributes.departmentAddress==hoverItem && (
                <div class="d-flex justify-content-center">
                  <Pagination activePage={getPageNumber(nodeDatum.attributes.departmentAddress)} pageEnd={nodeDatum.attributes.size} pageTabs={3} function={(item)=>nestedFunc(item, {data: nodeDatum})}/>
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
    <div id="treeWrapper" style={{ width: '60em', height: '50em' }}>
      {chartData && 
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
      }
    </div>
  );
}
export default DepartmentHierarchy;