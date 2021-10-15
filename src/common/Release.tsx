/** @jsx jsx */

import { jsx } from '@emotion/react';
import React, { useState, useEffect } from 'react'
import parseJSON from 'date-fns/parseJSON';
import { ProcessedRelease, UserOS } from '../types'
//import { Octokit } from '@octokit/rest';
import { getGithubLink, getSpecificDLLink } from '../releases';
import { githubRepoInfo } from '../constants';
//import processRelease from '../processRelease';
//
//
//const octokit = new Octokit();


interface ReleaseContextSpec {
  userOS?: UserOS
  specificDLLink?: string
  allReleasesURL?: string
  latestRelease?: {
    name: string
    date: Date
    notes: string
  }
}


export const ReleaseContext = React.createContext<ReleaseContextSpec>({});


function tagNameToAssetID(tagName: string): string {
  return tagName.slice(1);
}


interface GitHubReleaseContextProviderProps {
  releaseAtBuild?: ProcessedRelease
  repoOwner: string
  repoName: string 
}
export const GitHubReleaseContextProvider:
React.FC<GitHubReleaseContextProviderProps> =
function ({ releaseAtBuild, children }) {
  const [freshReleaseData, ] =
    useState<ProcessedRelease | undefined>(releaseAtBuild);

  const releaseData = freshReleaseData ?? releaseAtBuild;

  const assetID = tagNameToAssetID(releaseData.tag_name);

  const [userOS, setUserOS] =
    useState<UserOS | undefined>(undefined)

  const [specificDLLink, setSpecificDLLink] =
    useState<string | undefined>(releaseAtBuild && userOS
      ? getSpecificDLLink(
          releaseData?.assets ?? [],
          assetID,
          userOS)
      : undefined)

  //useEffect(() => {
  //  (async () => {
  //    const release = await octokit.repos.getLatestRelease(githubRepoInfo)
  //    setReleaseData(processRelease(release.data))
  //  })()
  //}, [])

  useEffect(() => {
    if (releaseData && userOS) {
      const link = getSpecificDLLink(
        releaseData.assets,
        assetID,
        userOS)
      if (link) {
        setSpecificDLLink(link)
      }
    }
  }, [userOS, JSON.stringify(releaseData)]);

  useEffect(() => {
    if (window?.navigator) {
      const ua = window.navigator.userAgent
      if (ua.indexOf('Mac') >= 0) {
        setUserOS('macOS')
      } else if (ua.indexOf('Windows') >= 0) {
        setUserOS('Windows')
      } else if (ua.indexOf('Ubuntu') >= 0 || ua.indexOf('Linux') >= 0) {
        setUserOS('Ubuntu Linux')
      }
    }
  }, [])

  const allReleasesURL = `${getGithubLink(githubRepoInfo.owner, githubRepoInfo.repo)}/releases`

  const releaseName = releaseData?.name

  const releaseDate = releaseData
    ? parseJSON(releaseData.published_at)
    : undefined

  const releaseNotesAtBuild = releaseAtBuild?.bodyHTML?.trim() ?? ''

  const releaseNotes = releaseAtBuild?.name === releaseName
    ? releaseNotesAtBuild
    : `<p>${(freshReleaseData?.body ?? '').split('\n')[0] ?? ''}</p>`
      // TODO: If there was a new release since last build,
      // we naively extract the first paragraph from release notes.
      // It may contain unparsed Markdown inline formatting
      // as we aren’t bringing Markdown parser to client-side yet
      // for performance reasons.

  const latestRelease = releaseName && (releaseDate !== undefined) && (releaseNotes !== undefined)
    ? {
        name: releaseName,
        date: releaseDate,
        notes: releaseNotes,
      }
    : undefined;

  return <ReleaseContext.Provider value={{ userOS, allReleasesURL, latestRelease, specificDLLink }}>
    {children}
  </ReleaseContext.Provider>
}
