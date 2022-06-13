import { useRouter } from "next/router";

export const useRefreshSSR = () => {
  const router = useRouter();

  return () => router.replace(router.asPath, router.asPath, { shallow: true });
};
