import { useInfiniteQuery } from '@tanstack/react-query';

/**
 * Generic infinite list helper.
 * - fetcher(params) should accept an object with page (or pageParam) and return the API response.
 * - The API is expected to return the paginated shape. The api client unwraps to `results` array and attaches `.meta` on the array.
 *
 * Returns the full useInfiniteQuery result so callers can destructure:
 * const { data: pages, isLoading: loading, error: err, fetchNextPage: fetchNext, hasNextPage: hasNext, isFetchingNextPage: fetchingNext, refetch: ref } = hookResult;
 */

export default function useInfiniteList(key, fetcher, deps = []) {
  const queryKey = Array.isArray(key) ? key.concat(deps || []) : [key].concat(deps || []);

  const result = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      // call fetcher with a page param; fetcher should return array (with .meta attached by api client) or full response
      const res = await fetcher({ page: pageParam });
      // If backend returned object (not unwrapped), try to extract results
      if (res && Array.isArray(res)) return res;
      if (res && res.results && Array.isArray(res.results)) {
        // attach meta onto results for consistency
        const arr = res.results;
        arr.meta = {
          links: res.links,
          count: res.count,
          page_size: res.page_size,
          total_pages: res.total_pages,
          current_page: res.current_page,
        };
        return arr;
      }
      // Fallback: return whatever came back
      return res;
    },
    getNextPageParam: (lastPage) => {
      // lastPage is expected to be an array with .meta
      const meta = lastPage?.meta;
      if (!meta) return undefined;
      if (meta.current_page < meta.total_pages) return meta.current_page + 1;
      return undefined;
    },
  });

  return result;
}
