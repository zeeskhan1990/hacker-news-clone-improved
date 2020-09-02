import React from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import styled from "styled-components";
import useWindowDimensions from "./hooks/useWindowDimensions";
import {list} from "./constants";
import logo from "./assets/images/y18.gif";

const Wrapper = styled.div`
margin-top: 10px;
display: flex;
justify-content: center;
`

const Header = styled.div`
background-color: #ff6600;
display: flex;
align-items: center;
.logo {
  margin-top: 3px;
  margin-left: 5px;
  img {
    border:1px white solid;
  }
}
.content {
  line-height:12pt;
  height:10px;
  font-family: Verdana, Geneva, sans-serif;
  font-size: 10pt;
  color: #222222;
  line-height: 12px;
}
`

export default function ListWrapper({
  hasNextPage,
  isNextPageLoading,
  items,
  loadNextPage
}) {

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const itemCount = hasNextPage ? items.length + 1 : items.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index) => !hasNextPage || index < items.length;

  
  const Item = ({ index, style }) => {
    let content;
    if (!isItemLoaded(index)) {
      content = "Loading...";
    } else {
      content = items[index].id;
    }

    return <div style={style}>{content}</div>;
  };

  return (
    <Wrapper>
      <div>
        <Header>
          <div className="logo">
            <img src={logo} width="18" height="18" />
          </div>
          <div className="content"></div>
        </Header>
        <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <List
                className="List"
                height={windowHeight - 20}
                itemCount={itemCount}
                itemSize={40}
                onItemsRendered={onItemsRendered}
                ref={ref}
                width={windowWidth - 200}
                minimumBatchSize={list.batchSize}
                threshold={20}
              >
                {Item}
              </List>
            )}
        </InfiniteLoader>
      </div>
        
    </Wrapper>
  );
}
