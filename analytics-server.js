/* eslint-disable no-console */
import { getSettings } from 'meteor/quave:settings';

export const PACKAGE_NAME = 'quave:analytics';
export const settings = getSettings({ packageName: PACKAGE_NAME });

const { googleAnalyticsTrackingId, googleAdsTrackingId } = settings || {};

const addAnalyticsTag = (sink, trackingId) => {
  sink.appendToHead(`
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', { 'transport_type': 'beacon' });
      ${googleAdsTrackingId ? `gtag('config', '${googleAdsTrackingId}');` : ''}
    </script>
    `);
};

export const addGoogleAnalyticsScript = sink => {
  addAnalyticsTag(sink, googleAnalyticsTrackingId);
};
