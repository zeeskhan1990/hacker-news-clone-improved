import React, { Fragment, useState } from "react";
import ListWrapper from "./ListWrapper";
import {list} from "./constants";
import request from "./request";

function App() {
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)
  const [items, setItems] = useState([])
  const [listType, setListType] = useState(list.type.top)
  const [storyList, setStoryList] = useState(null)

  const loadListDetails = async (storyList, startIndex) => {
    const endIndex = startIndex + (list.batchSize - 1) > list.maxSize - 1 ? list.maxSize - 1 : startIndex + (list.batchSize - 1)
    const allRequests = []
    for (let i=startIndex; i<=endIndex; i++) {
      allRequests.push(request.get(`/item/${storyList[i]}.json`))
    }
    const responses = await Promise.all(allRequests)
    debugger
    setIsNextPageLoading(false)
    setHasNextPage(items.length < list.maxSize)
    setItems([...items].concat(
      responses.map((response) => response.data)
    ))
  }

  const loadNextPage = async (startIndex) => {
    console.log("loadNextPage", startIndex);
    setIsNextPageLoading(true)
    let storyData = null
    if(!storyList) {
      try {
        debugger
        const response = await request.get(`/${listType}.json`)
        storyData = response.data
        setStoryList(storyData)
        loadListDetails(storyData, startIndex)        
      } catch(err) {
        console.log(err)
      }
    } else {
      loadListDetails(storyList, startIndex)      
    }
    /* request.get(`/${listType}.json`).then(({data}) => {
      console.log(data)
      setHasNextPage(items.length < list.maxSize)
      setIsNextPageLoading(false)
      setItems([...items].concat(
        new Array(list.batchSize).fill(true).map(() => ({ name: "Zeeshan Khan" }))
      ))
    }).catch(err => {
      console.log("Error", err)
      setIsNextPageLoading(false)
    }) */
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
