import React, { Fragment, useState } from "react";
import ListWrapper from "./ListWrapper";
import {list} from "./constants";
import request from "./request";

function App() {
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)
  const [items, setItems] = useState([])
  const [listType, setListType] = useState(list.type.top)

  const loadNextPage = (...args) => {
    console.log("loadNextPage", ...args);
    setIsNextPageLoading(true)
    request.get(`/${listType}.json`).then((response) => {
      console.log(response)
      setHasNextPage(items.length < list.maxSize)
      setIsNextPageLoading(false)
      setItems([...items].concat(
        new Array(10).fill(true).map(() => ({ name: "Zeeshan Khan" }))
      ))
    })
    
  };
  
  return (
      <Fragment>
        <ListWrapper
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          items={items}
          loadNextPage={loadNextPage}
          setListType={setListType}
          listType={listType}
        />
      </Fragment>
    );
}

export default App;
