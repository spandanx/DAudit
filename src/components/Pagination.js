import React, {useState} from 'react';
import {pointerHover} from './styles/cursor.js';

const Pagination = (props) => {

    const pageBegin = 0;
    const pageEnd = props.pageEnd;

    const maxPagesToDisplay =  props.pageTabs;

    const [pageOffset, setPageOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const getPages = () => {
        let pages = [];
        for (let i = pageOffset; i<getMin(pageEnd, pageOffset+maxPagesToDisplay); i++){
            pages.push(<li class="page-item" onClick={()=>props.function(i)}><a class="page-link" style={pointerHover}>{i+1}</a></li>);
        }
        return pages;
    }
    const getMax = (num1, num2) => {
        return (num1>num2)? num1 : num2;
    }
    const getMin = (num1, num2) => {
        return (num1<num2)? num1 : num2;
    }
    const prevSetOfPages = () => {
        if (prevPossible())
            setPageOffset(getMax(pageOffset-maxPagesToDisplay, 0));
    }
    const prevPossible = () => {
        return !(pageOffset==0);
    }
    const nextSetOfPages = () => {
        if (nextPossible())
            setPageOffset(getMin(pageOffset+maxPagesToDisplay, pageEnd));
    }
    const nextPossible = () => {
        return !(pageOffset+maxPagesToDisplay>=pageEnd);
    }

  return (
    <ul class="pagination">
      <li class={"page-item" + (!prevPossible()? ' disabled': '')} onClick={()=>prevSetOfPages()} style={(!prevPossible()? {}: pointerHover)}>
        <a class="page-link" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      {getPages()}
      <li class={"page-item" + (!nextPossible()? ' disabled': '')} onClick={()=>nextSetOfPages()} style={(!nextPossible()? {}: pointerHover)}>
        <a class="page-link" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  )
}

export default Pagination