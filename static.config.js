import makeStaticConfig from '@riboseinc/paneron-website-common/scaffolding/makeStaticConfig'

// NOTE: If we don’t refer to compiled JS here, we’ll get
// Trace: Error: Cannot find module './discoverReleases'.
// This can probably be resolved more elegantly, but there we go for now.
import discoverReleases from './compiled/discoverReleases'


export default {
  ...makeStaticConfig(),

  getRoutes: async () => {
    const releases = await discoverReleases();
    return [
      {
        path: '/',
        template: 'src/containers/Home',
        getData: () => ({
          releases,
        }),
      },
    ];
  },
};
