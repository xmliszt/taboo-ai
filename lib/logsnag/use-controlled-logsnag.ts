'use client';

/**
 * Hook to wrap the useLogSnag hook to only track when in production
 */
import { useLogSnag as track } from '@logsnag/next';

type TrackOptions = Parameters<ReturnType<typeof track>['track']>[number];
type IdentifyOptions = Parameters<ReturnType<typeof track>['identify']>[number];
type SetUserIdOptions = Parameters<ReturnType<typeof track>['setUserId']>[number];

export function useLogSnag() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
    return {
      setUserId: (options: SetUserIdOptions) => {
        console.log(
          `setUserId disabled in ${
            process.env.NEXT_PUBLIC_VERCEL_ENV
          } environment: ${JSON.stringify(options, null, 2)}`
        );
      },
      identify: (options: IdentifyOptions) => {
        console.log(
          `identify disabled in ${process.env.NEXT_PUBLIC_VERCEL_ENV} environment: ${JSON.stringify(
            options,
            null,
            2
          )}`
        );
      },
      track: (options: TrackOptions) => {
        console.log(
          `track disabled in ${process.env.NEXT_PUBLIC_VERCEL_ENV} environment: ${JSON.stringify(
            options,
            null,
            2
          )}`
        );
      },
    };
  }
  return track();
}
