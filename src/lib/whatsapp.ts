export function whatsappBookingHref(
  number: string,
  template: string,
  vars: { class: string; day: string; time: string },
) {
  const message = template
    .replaceAll('{class}', vars.class)
    .replaceAll('{day}', vars.day)
    .replaceAll('{time}', vars.time);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
