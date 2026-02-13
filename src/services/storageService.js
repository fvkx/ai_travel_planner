const STORAGE_KEY = "ai_travel_plans_multi";

export function loadPlans() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePlans(plans) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}
