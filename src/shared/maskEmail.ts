export function maskEmail(email: string): string {
  const atIndex = email.indexOf('@');
  if (atIndex === -1) return email;
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex); // includes @
  const visible = local.slice(0, 5);
  return `${visible}***${domain}`;
}
