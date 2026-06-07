export function validateDeadline(
  eventDate: string
) {
  const now = new Date();

  const event = new Date(eventDate);

  const diffHours =
    (event.getTime() - now.getTime()) /
    (1000 * 60 * 60);

  return diffHours >= 48;
}