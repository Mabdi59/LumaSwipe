import { useState, useCallback } from 'react';
import { destinations } from '../data/destinations';
import type { Destination } from '../data/destinations';

export function useSearch() {
  const [query, setQuery] = useState('');

  const results: Destination[] = query.trim()
    ? destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.country.toLowerCase().includes(query.toLowerCase()) ||
          d.vibe.toLowerCase().includes(query.toLowerCase()) ||
          d.category.some((c) => c.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const clearSearch = useCallback(() => setQuery(''), []);

  return { query, setQuery, results, clearSearch };
}
