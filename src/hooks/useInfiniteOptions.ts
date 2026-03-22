import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import type { AsyncApiConfig, FieldOption } from "@/components/forms/types";

// ─── Types ───

export type InfiniteOption = FieldOption;

export interface InfiniteOptionsResult {
  options: InfiniteOption[];
  hasMore: boolean;
  page: number;
}

/** Function signature for custom paginated fetch implementations */
export type FetchOptionsFunction = (
  searchTerm: string,
  page: number,
  pageSize: number
) => Promise<InfiniteOptionsResult>;

// ─── Helpers ───

/**
 * Safely retrieves a nested value from an object using a dot-separated path.
 * Example: getByPath({ a: { b: 1 } }, "a.b") → 1
 */
function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Builds an Axios request config from an AsyncApiConfig descriptor.
 * For POST/PUT/PATCH methods, params are merged into the request body.
 * For GET/DELETE, params are passed as query parameters.
 */
function buildAxiosConfig(
  apiConfig: AsyncApiConfig,
  params?: Record<string, string | number>
): AxiosRequestConfig {
  const cfg: AxiosRequestConfig = {
    url: apiConfig.url,
    method: apiConfig.method,
    headers: apiConfig.headers,
  };

  const isBodyMethod = ["POST", "PUT", "PATCH"].includes(apiConfig.method);

  if (isBodyMethod && (apiConfig.payload || params)) {
    cfg.data = { ...apiConfig.payload, ...params };
  } else if (params) {
    cfg.params = params;
  }

  return cfg;
}

/**
 * Maps a raw API response to an array of { label, value } options.
 * Uses the responseMapping config to locate the data array and extract label/value keys.
 */
function mapResponseToOptions(
  data: unknown,
  mapping: AsyncApiConfig["responseMapping"]
): InfiniteOption[] {
  const dataArray = getByPath(data as Record<string, unknown>, mapping.dataPath);
  if (!Array.isArray(dataArray)) return [];
  return dataArray.map((item: Record<string, unknown>) => ({
    label: String(item[mapping.labelKey] ?? ""),
    value: String(item[mapping.valueKey] ?? ""),
  }));
}

// ─── Async hook: one-time fetch via TanStack Query ───

export interface UseAsyncOptionsProps {
  /** Custom async function to fetch all options at once */
  fetchOptions?: () => Promise<InfiniteOption[]>;
  /** Declarative API config — used when no fetchOptions is provided */
  apiConfig?: AsyncApiConfig;
  /** Fallback options shown before the API response arrives */
  initialOptions?: InfiniteOption[];
}

/**
 * Fetches a flat list of options once when the component mounts.
 * Caches results for 5 minutes via TanStack Query.
 * Use this for async select/combobox fields that load all options upfront.
 */
export function useAsyncOptions({
  fetchOptions,
  apiConfig,
  initialOptions = [],
}: UseAsyncOptionsProps) {
  const queryKey = ["async-options", apiConfig?.url ?? "custom"];

  /** Resolves the correct fetcher: custom function or axios-based API call */
  const fetcher = useCallback(async (): Promise<InfiniteOption[]> => {
    if (fetchOptions) return fetchOptions();
    if (apiConfig?.url) {
      const res = await axios(buildAxiosConfig(apiConfig));
      return mapResponseToOptions(res.data, apiConfig.responseMapping);
    }
    return [];
  }, [fetchOptions, apiConfig]);

  const hasSource = !!fetchOptions || !!apiConfig?.url;

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: fetcher,
    enabled: hasSource,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  /** Merges initial options with fetched options, skipping duplicates implicitly */
  const options = useMemo(() => {
    if (!hasSource) return initialOptions;
    return [...initialOptions, ...(data ?? [])];
  }, [hasSource, initialOptions, data]);

  /**
   * Client-side filter for the fetched options list.
   * Matches both label and value (case-insensitive).
   */
  const filterOptions = useCallback(
    (term: string) => {
      if (!term) return options;
      const lower = term.toLowerCase();
      return options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(lower) ||
          opt.value.toLowerCase().includes(lower)
      );
    },
    [options]
  );

  return {
    options,
    isLoading: hasSource ? isLoading : false,
    error: error as Error | null,
    filterOptions,
  };
}

// ─── Infinite hook: paginated fetch via useInfiniteQuery + IntersectionObserver ───

interface UseInfiniteOptionsProps {
  /** Custom paginated fetch function. Takes search term, page, and page size */
  fetchOptions?: FetchOptionsFunction;
  /** Declarative API config — used when no fetchOptions is provided */
  apiConfig?: AsyncApiConfig;
  /** Number of items per page (default: 20) */
  pageSize?: number;
  /** Debounce delay for search input in milliseconds (default: 300) */
  debounceMs?: number;
  /** Whether the hook should actively fetch (default: true) */
  enabled?: boolean;
}

/**
 * Manages paginated, searchable option loading for infinite scroll fields.
 *
 * Features:
 * - Debounced search input to reduce API calls
 * - Automatic page-by-page fetching via useInfiniteQuery
 * - Deduplication of options across pages
 * - IntersectionObserver-based sentinel for triggering next-page loads
 * - Per-query caching keyed by search term
 */
export function useInfiniteOptions({
  fetchOptions,
  apiConfig,
  pageSize = 20,
  debounceMs = 300,
  enabled = true,
}: UseInfiniteOptionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  /** Debounces the search term to avoid firing queries on every keystroke */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), debounceMs);
    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  /**
   * Resolves the paginated fetch function from either:
   * - A custom fetchOptions callback, or
   * - A declarative AsyncApiConfig that gets translated to an axios call
   */
  const resolvedFetch = useMemo((): FetchOptionsFunction | null => {
    if (fetchOptions) return fetchOptions;
    if (!apiConfig?.url) return null;

    return async (search: string, page: number, size: number) => {
      const params: Record<string, string | number> = {};
      if (apiConfig.searchParam) params[apiConfig.searchParam] = search;
      if (apiConfig.pageParam) params[apiConfig.pageParam] = page;
      if (apiConfig.pageSizeParam) params[apiConfig.pageSizeParam] = size;

      const res = await axios(buildAxiosConfig(apiConfig, params));
      const options = mapResponseToOptions(res.data, apiConfig.responseMapping);

      // Determine if more pages exist from the API response
      const hasMore = apiConfig.hasMorePath
        ? !!(getByPath(res.data as Record<string, unknown>, apiConfig.hasMorePath))
        : false;

      return { options, hasMore, page };
    };
  }, [fetchOptions, apiConfig]);

  // Cache key resets when search term changes, triggering a fresh first-page fetch
  const cacheKey = debouncedTerm.toLowerCase() || "__all__";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["infinite-options", apiConfig?.url ?? "custom", cacheKey],
    queryFn: async ({ pageParam = 1 }) => {
      if (!resolvedFetch) return { options: [], hasMore: false, page: 1 };
      return resolvedFetch(debouncedTerm, pageParam as number, apiConfig?.pageSize ?? pageSize);
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: enabled && !!resolvedFetch,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  /** Flattens all fetched pages into a single deduplicated list (keyed by value) */
  const options = useMemo<InfiniteOption[]>(() => {
    if (!data?.pages) return [];
    const all = data.pages.flatMap((p) => p.options);
    return Array.from(new Map(all.map((o) => [o.value, o])).values());
  }, [data]);

  /**
   * Ref callback for attaching to a sentinel element at the bottom of the list.
   * Automatically calls fetchNextPage() when the sentinel becomes visible.
   */
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node) return;
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.1 }
      );
      observerRef.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  return {
    /** Flat, deduplicated list of options across all loaded pages */
    options,
    /** True while the first page is loading or any page is refetching */
    isLoading: isLoading || isFetching,
    /** True while an additional page is being fetched */
    isFetchingNextPage,
    /** True when there are more pages available to load */
    hasMore: !!hasNextPage,
    /** Current search input value */
    searchTerm,
    /** Update the search term (triggers debounce → new query) */
    setSearchTerm,
    /** Attach to a sentinel div to auto-trigger next-page loading on scroll */
    sentinelRef,
  };
}
