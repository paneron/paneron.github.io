import { Octokit } from '@octokit/rest';
import marked from 'marked';
import processRelease from './processRelease';
import { githubRepoInfo } from './constants';
import { Releases } from './types';


const octokit = new Octokit();


export function convertFirstBlockToHTML(markdown: string) {
  return marked.parser([marked.lexer(markdown)[0]]);
}


export default async function discoverReleases() {
  console.debug("Discovering releases…");
  let releases: Releases;
  try {
    releases = (await octokit.repos.listReleases(githubRepoInfo))?.data || [];
  } catch (e) {
    console.error("Error fetching product releases");
    throw e;
  }
  if (releases.length < 1) {
    console.warn("Fetched zero product releases")
    return [];
  }
  console.debug("Discovered releases:", releases.length);
  return releases.slice(0, 2).map(processRelease);
}
