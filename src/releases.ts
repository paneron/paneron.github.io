import { ProcessedRelease, UserOS } from './types'


export function getSpecificDLLink(
  assets: ProcessedRelease["assets"],
  releaseName: string,
  userOS: UserOS,
): string | undefined {
  let expectedOSAssetName: string

  console.debug("Getting DL link for", releaseName, assets);

  if (userOS === 'Windows') {
    expectedOSAssetName = `paneron-desktop-${releaseName}-portable.exe`
  } else if (userOS === 'macOS') {
    expectedOSAssetName = `paneron-desktop-${releaseName}.dmg`
  } else if (userOS === 'Ubuntu Linux') {
    expectedOSAssetName = `paneron-desktop-${releaseName}.snap`
  }

  const asset = assets.find(a => a.name === expectedOSAssetName)

  if (asset && asset.browser_download_url) {
    return asset.browser_download_url
  } else {
    return undefined
  }
}


export function getGithubLink(
  githubRepoOwner: string,
  githubRepoName: string,
): string {
  return `https://github.com/${githubRepoOwner}/${githubRepoName}`
}
