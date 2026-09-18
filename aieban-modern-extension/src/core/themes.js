// AI更易办 - 可扩展主题注册表。
const AiebanThemes = (() => {
  const themes = new Map();
  const appliedProperties = new WeakMap();
  let defaultThemeId = "luojia";

  const normalizeTokens = (tokens = {}) =>
    Object.fromEntries(
      Object.entries(tokens).filter(([property, value]) => property.startsWith("--aieban-") && value != null)
    );

  const register = (id, definition = {}) => {
    if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`无效的 AI更易办主题 ID：${id}`);
    themes.set(id, {
      label: definition.label || id,
      tokens: normalizeTokens(definition.tokens),
      light: normalizeTokens(definition.light),
      dark: normalizeTokens(definition.dark)
    });
    return api;
  };

  const setDefault = (id) => {
    defaultThemeId = id;
    return api;
  };

  const resolveId = (id) => {
    if (themes.has(id)) return id;
    if (themes.has(defaultThemeId)) return defaultThemeId;
    return themes.keys().next().value || "";
  };

  const getTokens = (id, mode) => {
    const resolvedId = resolveId(id);
    const base = themes.get(defaultThemeId) || themes.get(resolvedId);
    const selected = themes.get(resolvedId);
    return {
      ...(base?.tokens || {}),
      ...(base?.[mode] || {}),
      ...(selected?.tokens || {}),
      ...(selected?.[mode] || {})
    };
  };

  const apply = (root, id, mode = "light") => {
    if (!root) return "";
    const resolvedId = resolveId(id);
    const previous = appliedProperties.get(root) || [];
    previous.forEach((property) => root.style.removeProperty(property));

    const tokens = getTokens(resolvedId, mode);
    Object.entries(tokens).forEach(([property, value]) => root.style.setProperty(property, value));
    appliedProperties.set(root, Object.keys(tokens));
    root.dataset.aiebanTheme = resolvedId;
    return resolvedId;
  };

  const api = {
    register,
    setDefault,
    apply,
    has: (id) => themes.has(id),
    list: () => Array.from(themes, ([id, theme]) => ({ id, label: theme.label })),
    getDefault: () => defaultThemeId
  };

  globalThis.AiebanThemes = api;
  return api;
})();
