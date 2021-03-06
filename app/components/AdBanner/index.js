import React, { Component } from 'react';
import isMobile from 'utils/common';

class AdBanner extends Component {

	componentDidMount() {
		(window.adsbygoogle = window.adsbygoogle || []).push({})
	}

	render() {
		var style = {
			display: 'block',
			maxWidth: '300px',
			margin: '15px'
		};

		if (isMobile()){
			style.margin = '15px auto';			
		}

		return(
			// <ins className="adsbygoogle"
			//      style={style}
			//      data-ad-client="ca-pub-XXXXXXXXXXXXX"
			//      data-ad-slot={this.props.slot}
			//      data-ad-format="auto">
			// </ins>
			<ins className="adsbygoogle"
		     style={style}
		     data-ad-format="fluid"
		     data-ad-layout-key="-8s+1w-dq+e9+ft"
		     data-ad-client="ca-pub-1646912741264969"
		     data-ad-slot="3020839966"></ins>
		);
	}
}

export default AdBanner;