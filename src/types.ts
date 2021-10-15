import type { RestEndpointMethodTypes } from '@octokit/rest';
import type { components } from '@octokit/openapi-types';


export type UserOS = 'macOS' | 'Windows' | 'Ubuntu Linux';

export type Asset = components["schemas"]["release-asset"];
export type Release = components["schemas"]["release"];
export type Releases = RestEndpointMethodTypes["repos"]["listReleases"]["response"]["data"];


export interface ProcessedRelease {
  name: string,
  assets: { name: string, browser_download_url: string }[],
  tag_name: string,
  body: string,
  published_at: string,
  bodyHTML: string,
}
