export const clp = value => new Intl.NumberFormat('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 }).format(Number(value || 0))
export const date = value => { if (!value) return '—'; const d = new Date(`${value}T12:00:00`); return isNaN(d) ? '—' : new Intl.DateTimeFormat('es-CL', { dateStyle:'medium' }).format(d) }
export const datetime = value => { if (!value) return '—'; const d = new Date(value); return isNaN(d) ? '—' : new Intl.DateTimeFormat('es-CL', { dateStyle:'medium', timeStyle:'short' }).format(d) }
export const isoToday = () => new Date().toLocaleDateString('en-CA', { timeZone:'America/Santiago' })
export function urgency(value) { const d = Math.round((new Date(`${value}T12:00:00`) - new Date(`${isoToday()}T12:00:00`)) / 86400000); return d < 0 ? ['vencida','Vencida'] : d <= 5 ? ['proxima', d === 0 ? 'Vence hoy' : `Vence en ${d}d`] : ['vigente','Vigente'] }
