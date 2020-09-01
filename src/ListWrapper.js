import React from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import useWindowDimensions from "./hooks/useWindowDimensions";

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
      content = items[index].name;
    }

    return <div style={style}>{content}</div>;
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          className="List"
          height={windowHeight - 100}
          itemCount={itemCount}
          itemSize={40}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width={windowWidth - 100}
        >
          {Item}
        </List>
      )}
    </InfiniteLoader>
  );
}
