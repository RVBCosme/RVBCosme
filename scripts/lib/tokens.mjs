// ADR-001 tokens. The two themes differ only in these values (ADR-003).
export const TOKENS = {
  light: { sheet: '#F4F6F7', grid: '#E1E7EF', line: '#22407F', line2: '#52668E', title: '#172E5E', red: '#C23F2D', live: '#0E8A57', icon: '#1F2328' },
  dark: { sheet: '#0F2A47', grid: '#1B4066', line: '#E6EEF7', line2: '#A3B8D2', title: '#FFFFFF', red: '#FF8D77', live: '#6EE7B7', icon: '#FFFFFF' },
};

export const THEMES = Object.keys(TOKENS);

export function tokenCss(theme) {
  const tokens = TOKENS[theme];
  if (!tokens) throw new Error(`Unknown theme "${theme}"`);
  return `:root{${Object.entries(tokens).map(([name, value]) => `--${name}:${value}`).join(';')}}`;
}
