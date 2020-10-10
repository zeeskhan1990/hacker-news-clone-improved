import React, { Fragment, useState, useEffect, useRef } from "react";
import ListWrapper from "./ListWrapper";
import {list} from "./constants";
import request from "./request";
import "./App.css";

function App() {
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)
  const [items, setItems] = useState([])
  const [listType, setListType] = useState(list.type.top)
  const [storyList, setStoryList] = useState(null)
  const listTypeRef = useRef(listType)

  const loadListDetails = async (stories, startIndex) => {
    const endIndex = startIndex + (list.batchSize - 1) > list.maxSize - 1 ? list.maxSize - 1 : startIndex + (list.batchSize - 1)
    const allRequests = []
    for (let i=startIndex; i<=endIndex; i++) {
      allRequests.push(request.get(`/item/${stories[i]}.json`))
    }
    const responses = await Promise.all(allRequests)
    if(listTypeRef.current === listType) {
      setIsNextPageLoading(false)
      setHasNextPage(items.length < list.maxSize)
      setItems([...items].concat(
        responses.map((response) => response.data)
      ))
    }
  }

  const loadNextPage = async (startIndex) => {
    console.log("loadNextPage", startIndex);
    setIsNextPageLoading(true)
    let storyData = null
    if(!storyList) {
      try {
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
  };

  const handleListTypeChange = () => {
    setStoryList(null)
    setItems([])
    setHasNextPage(true)
    setIsNextPageLoading(false)
  }

  useEffect(() => {
    listTypeRef.current = listType
    handleListTypeChange()
  }, [listType])
  
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
