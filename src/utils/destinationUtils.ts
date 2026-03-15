import { destinations } from '../data/destinations';
import type { Destination } from '../data/destinations';

export function getRandomDestination(excludeId?: string): Destination {
  const pool = excludeId ? destinations.filter((d) => d.id !== excludeId) : destinations;
  return pool[Math.floor(Math.random() * pool.length)];
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
