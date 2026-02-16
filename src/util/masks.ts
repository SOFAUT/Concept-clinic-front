/**
 * Retorna apenas dígitos da string.
 */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Máscara CNPJ: 00.000.000/0001-00 (14 dígitos)
 */
export function maskCnpj(value: string): string {
  const d = onlyDigits(value).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

/**
 * Máscara CEP: 00000-000 (8 dígitos)
 */
export function maskCep(value: string): string {
  const d = onlyDigits(value).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

/**
 * Máscara Telefone: (00) 00000-0000 celular ou (00) 0000-0000 fixo (10 ou 11 dígitos)
 */
export function maskTelefone(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return d.length === 1 ? `(${d}` : `(${d})`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`; // fixo
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`; // celular 11 dígitos
}
