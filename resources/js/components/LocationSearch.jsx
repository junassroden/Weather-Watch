import { Search } from "lucide-react";
import { useState } from "react";

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

    const submitSearch = async (event) => {
        event.preventDefault();
        if (!query.trim()) return;

        try {
            setResults(await searchLocation(query.trim()));
        } catch {
            setResults([]);
        }
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
        >
            <Search size={16} aria-hidden="true" />

            <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
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