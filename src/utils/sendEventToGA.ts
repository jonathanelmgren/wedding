export const sendEventToGA = (
  action: string,
  category: string,
  label: string,
  value: string,
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
