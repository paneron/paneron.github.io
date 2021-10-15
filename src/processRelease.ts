import { Asset, Release } from './types';
import { convertFirstBlockToHTML } from './discoverReleases';


export default function processRelease(r: Release) {
  return {
    name: r.name,
    assets: r.assets.map(getAssetData),
    body: r.body,
    published_at: r.published_at,
    tag_name: r.tag_name,

    bodyHTML: r.body ? convertFirstBlockToHTML(r.body) : '',
  };
}

function getAssetData(a: Asset) {
  return {
    name: a.name,
    browser_download_url: a.browser_download_url,
  };
}
