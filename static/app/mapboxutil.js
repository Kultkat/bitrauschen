'use strict';
// @flow

var config = {
    API_URL: 'https://api.mapbox.com',
    REQUIRE_ACCESS_TOKEN: true,
    ACCESS_TOKEN: mapboxglAccessToken
};

var hardwareConcurrency = window.navigator.hardwareConcurrency || 4;

// Object.defineProperty(exports, 'devicePixelRatio', {
//     get: function() { return window.devicePixelRatio; }
// });

var supportsWebp = false;

var webpImgTest = window.document.createElement('img');
webpImgTest.onload = function() {
    supportsWebp = true;
};
webpImgTest.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA=';

function makeAPIURL(urlObject, accessToken) {
    var apiUrlObject = parseUrl(config.API_URL);
    urlObject.protocol = apiUrlObject.protocol;
    urlObject.authority = apiUrlObject.authority;

    if (!config.REQUIRE_ACCESS_TOKEN) { return formatUrl(urlObject); }

    accessToken = accessToken || config.ACCESS_TOKEN;
    if (!accessToken)
        { throw new Error("An API access token is required to use Mapbox GL. "); }
    if (accessToken[0] === 's')
        { throw new Error("Use a public access token (pk.*) with Mapbox GL, not a secret access token (sk.*). "); }

    urlObject.params.push(("access_token=" + accessToken));
    return formatUrl(urlObject);
}

function isMapboxURL(url) {
    return url.indexOf('mapbox:') === 0;
}

function normalizeStyleURL(url, accessToken) {
    if (!isMapboxURL(url)) { return url; }
    var urlObject = parseUrl(url);
    urlObject.path = "/styles/v1" + (urlObject.path);
    return makeAPIURL(urlObject, accessToken);
};

function normalizeGlyphsURL(url, accessToken) {
    if (!isMapboxURL(url)) { return url; }
    var urlObject = parseUrl(url);
    urlObject.path = "/fonts/v1" + (urlObject.path);
    return makeAPIURL(urlObject, accessToken);
};

function normalizeSourceURL(url, accessToken) {
    if (!isMapboxURL(url)) { return url; }
    var urlObject = parseUrl(url);
    urlObject.path = "/v4/" + (urlObject.authority) + ".json";
    // TileJSON requests need a secure flag appended to their URLs so
    // that the server knows to send SSL-ified resource references.
    urlObject.params.push('secure');
    return makeAPIURL(urlObject, accessToken);
};

function normalizeSpriteURL(url, format, extension, accessToken) {
    var urlObject = parseUrl(url);
    if (!isMapboxURL(url)) {
        urlObject.path += "" + format + extension;
        return formatUrl(urlObject);
    }
    urlObject.path = "/styles/v1" + (urlObject.path) + "/sprite" + format + extension;
    return makeAPIURL(urlObject, accessToken);
};

var imageExtensionRe = /(\.(png|jpg)\d*)(?=$)/;

function normalizeTileURL(tileURL, sourceURL, tileSize) {
    if (!sourceURL || !isMapboxURL(sourceURL)) { return tileURL; }

    var urlObject = parseUrl(tileURL);

    // The v4 mapbox tile API supports 512x512 image tiles only when @2x
    // is appended to the tile URL. If `tileSize: 512` is specified for
    // a Mapbox raster source force the @2x suffix even if a non hidpi device.
    var suffix = window.devicePixelRatio >= 2 || tileSize === 512 ? '@2x' : '';
    var extension = browser.supportsWebp ? '.webp' : '$1';
    urlObject.path = urlObject.path.replace(imageExtensionRe, ("" + suffix + extension));

    replaceTempAccessToken(urlObject.params);
    return formatUrl(urlObject);
};

function replaceTempAccessToken(params) {
    for (var i = 0; i < params.length; i++) {
        if (params[i].indexOf('access_token=tk.') === 0) {
            params[i] = "access_token=" + (config.ACCESS_TOKEN || '');
        }
    }
}

var urlRe = /^(\w+):\/\/([^/?]+)(\/[^?]+)?\??(.+)?/;

function parseUrl(url) {
    var parts = url.match(urlRe);
    if (!parts) {
        throw new Error('Unable to parse URL object');
    }
    return {
        protocol: parts[1],
        authority: parts[2],
        path: parts[3] || '/',
        params: parts[4] ? parts[4].split('&') : []
    };
}

function formatUrl(obj) {
    var params = obj.params.length ? ("?" + (obj.params.join('&'))) : '';
    return ((obj.protocol) + "://" + (obj.authority) + (obj.path) + params);
}

