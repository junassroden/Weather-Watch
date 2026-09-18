import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { searchLocation } from "../services/api";

/* One search control, used by both the header and the forecast left
   panel, so location search looks and behaves identically everywhere
   instead of each surface styling its own input. */
export default function LocationSearch({
    onLocationSelect,
    placeholder = "Search city...",
    variant = "default",
}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const abortControllerRef = useRef(null);
    const debounceTimeoutRef = useRef(null);

    const performSearch = async (value) => {
        const trimmedQuery = value.trim();
        clearTimeout(debounceTimeoutRef.current);

        if (trimmedQuery.length < 2) {
            abortControllerRef.current?.abort();
            setResults([]);
            setIsSearching(false);
            return;
        }

        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;
        setIsSearching(true);

        try {
            setResults(await searchLocation(trimmedQuery, { signal: controller.signal }));
        } catch (error) {
            if (!controller.signal.aborted) {
                setResults([]);
            }
        } finally {
            if (abortControllerRef.current === controller) {
                setIsSearching(false);
            }
        }
    };

    useEffect(() => {
        debounceTimeoutRef.current = setTimeout(() => performSearch(query), 250);

        return () => {
            clearTimeout(debounceTimeoutRef.current);
            abortControllerRef.current?.abort();
        };
    }, [query]);

    const submitSearch = async (event) => {
        event.preventDefault();
        await performSearch(query);
    };

    const selectLocation = (result) => {
        setQuery(result.name);
        setResults([]);
        onLocationSelect?.(result);
    };

    return (
        <form
            className={`location-search location-search-${variant}`}
            onSubmit={submitSearch}
            role="search"
            aria-busy={isSearching}
        >
            <Search size={16} strokeWidth={1} aria-hidden="true" />

            <input
                value={query}
                onChange={(event) => {
                    setQuery(event.target.value);
                    setResults([]);
                }}
                placeholder={placeholder}
                aria-label="Search location"
            />

            {results.length > 0 && (
                <div className="search-results">
                    {results.slice(0, 5).map((result) => (
                        <button
                            type="button"
                            key={`${result.latitude}-${result.longitude}`}
                            onClick={() => selectLocation(result)}
                        >
                            <span>{result.name}</span>
                            <small>
                                {[result.admin1, result.country].filter(Boolean).join(", ")}
                            </small>
                        </button>
                    ))}
                </div>
            )}
        </form>
    );
}