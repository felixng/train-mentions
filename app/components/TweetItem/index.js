import React from 'react';
import Wrapper from './Wrapper';
import { Tweet } from 'react-twitter-widgets';
import isMobile from 'utils/common';

function TweetItem(props) {
  var width = 320;
  
  if (isMobile()){
    width = props.width - 20;
  }

  return (
    <Wrapper>
    	<Tweet tweetId={props.item} 
	           options={{ cards: 'hidden', 
	                      align: 'centre', 
	                      linkColor: '#f39264',
	                      width: width }}
             onLoad={props.onLoaded}/>
    </Wrapper>
  );
}

TweetItem.propTypes = {
  item: React.PropTypes.any,
};

export default TweetItem;
