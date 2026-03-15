import { destinations } from '../data/destinations';
import type { Destination } from '../data/destinations';

export function getRandomDestination(
  pool: Destination[] = destinations,
  excludeId?: string
): Destination | undefined {
  const candidates = excludeId ? pool.filter((destination) => destination.id !== excludeId) : pool;
  const selectionPool = candidates.length > 0 ? candidates : pool;

  if (selectionPool.length === 0) {
    return undefined;
  }

  return selectionPool[Math.floor(Math.random() * selectionPool.length)];
}

export function getDestinationById(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}

export function filterByCategory(category: string): Destination[] {
  if (category === 'All') return destinations;
  return destinations.filter((d) => d.category.includes(category));
}

export function ratingStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}
