/** @jsx jsx */

import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled'
import { useRouteData } from 'react-static'
import formatRelative from 'date-fns/formatRelative'
import format from 'date-fns/format'
import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { PageTitle } from '@riboseinc/paneron-website-common/elements/misc'
import { Card } from '@riboseinc/paneron-website-common/elements/cards'
import { Button, Link } from '@riboseinc/paneron-website-common/elements/buttons-links';
import { BIG_SCREEN_BREAKPOINT_PX } from '@riboseinc/paneron-website-common/ui-constants';
import { ProcessedRelease } from '../types'
import { GitHubReleaseContextProvider, ReleaseContext } from '../common/Release'
import { githubRepoInfo } from '../constants'


export default function () {
  const { releases } = useRouteData<{ releases: ProcessedRelease[] }>()
  const latestRelease = releases[0] ?? undefined;

  return (
    <React.Fragment>
      <PageTitle>
        Paneron aims to simplify collaborative structured data editing.
      </PageTitle>
      <GitHubReleaseContextProvider
          releaseAtBuild={latestRelease}
          repoName={githubRepoInfo.repo}
          repoOwner={githubRepoInfo.owner}>
        <Card css={css`
            padding: 1.4rem;
            @media screen and (min-width: ${BIG_SCREEN_BREAKPOINT_PX}px) {
              max-width: 80vw;
            }`}>
          <Release />
        </Card>
      </GitHubReleaseContextProvider>
    </React.Fragment>
  )
}


const Release: React.FC<Record<never, never>> = function () {
  const ctx = useContext(ReleaseContext);
  return (
    <div>
      {ctx.userOS && ctx.specificDLLink
        ? <Button
              css={css`display: inline-block; margin-bottom: .5rem;`}
              to={ctx.specificDLLink}
              title={`Download${ctx.latestRelease?.name ? ` v${ctx.latestRelease.name}` : null} for ${ctx.userOS}`}>
            <FontAwesomeIcon icon={faDownload} />
            &ensp;
            Download Paneron Desktop for {ctx.userOS}
          </Button>
        : <Button to={ctx.allReleasesURL} css={css`display: inline-block; margin-bottom: .5rem;`}>
            Download Paneron Desktop
          </Button>}
      <Label>
        <span style={{ whiteSpace: 'nowrap'}}>
          {ctx.latestRelease?.name
            ? <React.Fragment><strong>{ctx.latestRelease.name}</strong>&emsp;•&emsp;</React.Fragment>
            : null}
          {ctx.latestRelease?.date
            ? <time dateTime={ctx.latestRelease.date.toISOString()}>
                {formatRelative(ctx.latestRelease.date, new Date())}
                &emsp;•&emsp;
                {format(ctx.latestRelease.date, 'MMMM yyyy')}
              </time>
            : null}
        </span>
        {ctx.latestRelease?.notes
          ? <ReleaseBody dangerouslySetInnerHTML={{ __html: ctx.latestRelease.notes }} />
          : <br />}
        <Link to={ctx.allReleasesURL}>
          <FontAwesomeIcon icon={faGithub} />
          &ensp;
          Read all release notes
        </Link>
      </Label>
    </div>
  );
}


const ReleaseBody = styled.div`
  p {
    margin: .5rem 0;
  }
`

export const Label = styled.div`
  font-size: 14px;
  color: #444;
  margin: 0;
  margin-left: .1rem;

  @media screen and (min-width: 800px) {
    padding-right: 2rem;
  }
`
