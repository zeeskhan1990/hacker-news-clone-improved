import React from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import styled from "styled-components";
import ReactHtmlParser from 'react-html-parser';
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
  padding-top: 10px;
`

const ListItem = styled.div`
margin-left: 5px;
.main {
  display: flex;
  .count {    
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .sitebit {
    margin-left: 10px;
    font-size: 7pt;
    margin-top: 4px;
  }
  a {
    margin-left: 5px;
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
  margin-left: 55px;
  font-size: 7pt;
  display: flex;
}
`

const getTimeDifference = (diffTime) => {
  const currentUnixTime = Math.floor(new Date().getTime()/1000)
  const diffInSeconds = currentUnixTime - diffTime
  if(diffInSeconds <= 60) {
    return `1 minute`
  } else if(diffInSeconds <= 3600) {
    return `${Math.floor(diffInSeconds/60)} minutes`
  } else if(diffInSeconds <= 3600*24) {
    return `${Math.floor(diffInSeconds/3600)} hours`
  } else {
    return `${Math.floor(diffInSeconds/(3600*24))} days`
  }
  // Need further check if singular or plural, i.e, minute/minutes and day/days
}

// NOT full proof, need a lookup to http://publicsuffix.org/ to check multi block subdomains such as .co.uk
const getSitebitUrl = (url) => {
  if(!!url) {    
    const hostName = new URL(url).hostname
    const separate = hostName.split('.')
    if(separate[separate.length -1] === "com" && separate[separate.length -2] === "ycombinator") {
      return null
    } else {
      if(separate.length > 2) {
        if(separate[separate.length -1] === "com" || separate[separate.length -1] === "net" || separate[separate.length -1] === "org" ) {
          separate.shift()
          return separate.join('.')
        } else {
          return hostName
        }
      } else {
        return hostName
      }
    }
  } else {
    return null
  }
}

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
      const sitebitUrl = getSitebitUrl(content.url)
      return (
        <div style={style}>
          <ListItem>
            <div className="main">
              <div className="count">
                <span>{index + 1}.</span>
                <img src={arrow} width="10" height="10" />
              </div>
              <a href={content.url}>{ReactHtmlParser(content.title)}</a>
              <span className="sitebit">
                {sitebitUrl ? `(${sitebitUrl})` : null}
              </span>
            </div>
            <div className="sub">
              <span>{content.score} points by {content.by} {getTimeDifference(content.time)} ago |</span>
              <span>&nbsp;hide |</span>
              <span>&nbsp;{content.descendants} comments</span>
            </div>
          </ListItem>
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
            <span style={{marginLeft: 10, cursor: 'pointer'}}>new</span>
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
