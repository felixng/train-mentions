import React from 'react';
import Wrapper from './Wrapper';
import { Tweet } from 'react-twitter-widgets';
import isMobile from 'utils/common';

function TweetItem(props) {
  if (isMobile()){
    var width = props.cardWidth - 20;
  }
  else {
    var width = 320;  
  }
  
  if (props.cardWidth != 0){
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
  else return null;
}

TweetItem.propTypes = {
  item: React.PropTypes.any,
};

export default TweetItem;
