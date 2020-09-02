import React from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import styled from "styled-components";
import useWindowDimensions from "./hooks/useWindowDimensions";
import {list} from "./constants";
import logo from "./assets/images/y18.gif";
import arrow from "./assets/images/grayarrow.gif";

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
  margin-left: 5px;
  margin-bottom: -1px;
  margin-top: 1px;
  img {
    border:1px white solid;
  }
}
.content {
  height:10px;
  margin-left: 5px;
  color: #222222;
  line-height: 12px;
}
`

const Container = styled.div`
  background-color: #F6F6EF;
`

const ListItem = styled.div`
margin-left: 5px;
.main {
  display: flex;
  .count {    
    width: 30px;
    display: flex;
    align-items: center;
  }
  a {
    &:visited {
      color: #828282;
      text-decoration: none;
    }
    &:link {
      color: #000000;
      text-decoration: none;
    }
  }
}
.sub {
  margin-left: 30px;
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
    if (!isItemLoaded(index)) {
      return <div style={style}>Loading...</div>;
    } else {
      const content = items[index];
      return (
        <div style={style}>
          <ListItem>
            <div className="main">
              <div className="count">
                <span>${index + 1}.</span>
                <img src={arrow} width="10" height="10" />
              </div>
              
            </div>
            <div className="sub">

            </div>
          </ListItem>
          {content.id}
        </div>
      );
    }
  };

  return (
    <Wrapper>
      <div>
        <Header>
          <div className="logo">
            <img src={logo} width="18" height="18" />
          </div>
          <div className="content">
            <b>Hacker News</b>
          </div>
        </Header>
        <Container>
          <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreItems}
            >
              {({ onItemsRendered, ref }) => (
                <List
                  className="List"
                  height={windowHeight - 40}
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
        </Container>
      </div>
    </Wrapper>
  );
}
