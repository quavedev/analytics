/* eslint-disable no-console */
import { getSettings } from 'meteor/quave:settings';

import { Meteor } from 'meteor/meteor';
import { useEffect, useRef } from 'react';

export const PACKAGE_NAME = 'quave:analytics';
export const settings = getSettings({ packageName: PACKAGE_NAME });

const { googleAnalyticsTrackingId, googleAdsTrackingId, debug } = settings || {};

const ga = (...rest) => {
  const googleAnalytics = window.gtag;
  if (!googleAnalytics || typeof googleAnalytics !== 'function') {
    // eslint-disable-next-line no-console
    console.warn('googleAnalytics is not available', googleAnalytics);
    return;
  }
  googleAnalytics(...rest);
};

export const sendConfigToAnalytics = (data, options) => {
  ga('config', googleAnalyticsTrackingId, data, options);
};

export const sendEventToAnalytics = (action, data) => {
  ga('event', action, data);
};

/**
 * inspired by https://github.com/mib200/vue-gtm/
 */
const hasScript = () =>
  Array.from(document.getElementsByName('script')).some(script =>
    script.src.includes('googletagmanager')
  );

export const loadGoogleAnalytics = () => {
  if (!Meteor.isClient || hasScript()) {
    return false;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsTrackingId}`;
  document.head.appendChild(script);
  const scriptContent = document.createElement('script');
  scriptContent.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleAnalyticsTrackingId}', { 'transport_type': 'beacon' });
      ${
        googleAdsTrackingId ? `gtag('config', '${googleAdsTrackingId}');` : ''
      } \
    `;
  document.head.appendChild(scriptContent);
  return true;
};

export const initializeGoogleAnalytics = () => {
  loadGoogleAnalytics();

  // https://developers.google.com/analytics/devguides/collection/gtagjs/cookies-user-id
  sendConfigToAnalytics({
    user_id: Meteor.userId(),
  });
};

export const useGoogleAnalyticsPageView = ({ title } = {}) => {
  const pageLocationPath = window.location.pathname;

  const lastPageLocationPathRef = useRef(null);

  useEffect(() => {
    if (
      !lastPageLocationPathRef.current ||
      lastPageLocationPathRef.current !== pageLocationPath
    ) {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('pageview', pageLocationPath);
      }
      sendConfigToAnalytics({
        page_title: title || (window.document && window.document.title),
        page_location: window.location.href,
        page_path: pageLocationPath,
      });
    }
    lastPageLocationPathRef.current = pageLocationPath;
  }, [pageLocationPath, title]);
};
