const KEY = 'ck_portfolio_items_v1'
const HERO_KEY = 'ck_hero_settings_v1'

// Optional server API
const API = '/api'

export function readItems() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function writeItems(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function addItem(item) {
  const items = readItems()
  const normalized = {
    ...item,
    images: item.images
      ? Array.isArray(item.images)
        ? item.images
        : String(item.images).split(',').map(s => s.trim()).filter(Boolean)
      : [],
    technologies: item.technologies
      ? String(item.technologies).split(',').map(s => s.trim()).filter(Boolean)
      : [],
    features: item.features
      ? String(item.features).split('\n').map(s => s.trim()).filter(Boolean)
      : []
  }
  const withId = { id: crypto.randomUUID(), createdAt: Date.now(), ...normalized }
  items.unshift(withId)
  writeItems(items)
  return withId
}

export function removeItem(id) {
  const items = readItems().filter(i => i.id !== id)
  writeItems(items)
}

// Hero settings
export function readHero() {
  try {
    const raw = localStorage.getItem(HERO_KEY)
    return raw ? JSON.parse(raw) : { introText: 'Hello, I’m Chalanka Kodikara', heroImage: '' }
  } catch {
    return { introText: 'Hello, I’m Chalanka Kodikara', heroImage: '' }
  }
}

export function writeHero(settings) {
  localStorage.setItem(HERO_KEY, JSON.stringify(settings))
}


