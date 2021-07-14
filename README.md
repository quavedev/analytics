# quave:analytics

`quave:analytics` is a Meteor package that allows you to send your page views and more to Google Analytics

## Why

Every application needs to have some analytics data sent somewhere.

We use Google Analytics via a React Hook that can be used in every React app.

We believe we are not reinventing the wheel in this package but what we are doing is like putting together the wheels in the vehicle :).

## Installation

```sh
meteor add quave:analytics
meteor add server-render
```

## Usage

You need to configure this package using your settings.

You need to set 
- `googleAnalyticsTrackingId`: define which property (sub-level of account) of Google Analytics you want to assign.
```
{
  "public": {
    "packages": {
      "quave:analytics": {
        "googleAnalyticsTrackingId": "UA-39171111-11"
      }
    }
  }
}

```

Now you need to set up your server to return the tracking ID in your initial HTML. We do this using `sink` object from Meteor `server-render` package

On server you can use `addGoogleAnalyticsScript`
```javascript
import { onPageLoad } from 'meteor/server-render';

import { addGoogleAnalyticsScript } from 'meteor/quave:analytics';

onPageLoad(sink => {
  addGoogleAnalyticsScript(sink);
});
```

On client you can add the tags using `initializeGoogleAnalytics`
```javascript
import { initializeGoogleAnalytics } from 'meteor/quave:analytics';

Meteor.startup(() => {
  initializeGoogleAnalytics();
});
```

And send the page views using `useGoogleAnalyticsPageView` React hook
```javascript
import { useGoogleAnalyticsPageView } from 'meteor/quave:analytics';

const Routes = () => {
  useGoogleAnalyticsPageView();
}
```

## Debugging

Add `debug: true` to package settings to see page view logs in the client.

### License

MIT
