import React from 'react';
import ReactDOM from 'react-dom';
import match from 'react-router/lib/match';
import applyRouterMiddleware from 'react-router/lib/applyRouterMiddleware';
import Router from 'react-router/lib/Router';
import useScroll from 'react-router-scroll/lib/useScroll';
import AppRoot from 'containers/AppRoot';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-42166600-18');

function logPageView() {
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
}

export default function renderInBrowser({ messages, store, routes, history }) {
  match({ history, routes }, (error, redirectLocation, renderProps) => {
    ReactDOM.render(
      <AppRoot store={store} messages={messages}>
        <Router
          {...renderProps}
          onUpdate={logPageView}
          render={
            // Scroll to top when going to a new page, imitating default browser behaviour
            applyRouterMiddleware(useScroll())
          }
        />
      </AppRoot>,
      document.getElementById('app')
    );
  });
}
