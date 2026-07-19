import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../api/client'
import { Badge, Empty } from '../components/UI'
import { clp, date, isoToday, urgency } from '../utils'

export default function Dashboard() {
  const [data, setData] = useState(null); const [error, setError] = useState('')
  useEffect(() => { Promise.all([get('/documentos?estado=pendiente'),get('/tareas'),get('/calendario')]).then(([docs,tasks,events])=>setData({docs,tasks,events})).catch(()=>setError('No fue posible cargar el panel. Revisa la API URL y la clave.')) }, [])
  if (error) return <p className="notice error">{error}</p>; if (!data) return <p className="loading">Cargando resumen…</p>
  const today = isoToday(), tomorrow = new Date(new Date(`${today}T12:00`).getTime()+86400000).toLocaleDateString('en-CA')
  const { docs, tasks, events } = data; const overdue = docs.filter(d=>d.fecha_vencimiento < today); const upcoming = docs.filter(d=>{const x=urgency(d.fecha_vencimiento)[0]; return x==='proxima'}); const alerts = [...docs].sort((a,b)=>a.fecha_vencimiento.localeCompare(b.fecha_vencimiento)).slice(0,5); const nextEvents = events.filter(e=>e.fecha === today || e.fecha === tomorrow)
  return <><header><p className="eyebrow">RESUMEN GENERAL</p><h1>Dashboard</h1><p className="muted">Hoy, {date(today)}</p></header><section className="stats"><article><small>TOTAL POR COBRAR</small><strong>{clp(docs.reduce((sum,d)=>sum+Number(d.saldo_pendiente||0),0))}</strong></article><article><small>DOCUMENTOS VENCIDOS</small><strong>{overdue.length}</strong></article><article><small>PRÓXIMOS A VENCER</small><strong>{upcoming.length}</strong></article><article><small>TAREAS PARA HOY</small><strong>{tasks.filter(t=>!t.completada && (t.columna==='hoy' || t.fecha===today)).length}</strong></article></section><section className="two-col"><article className="panel"><div className="panel-title"><h2>Alertas de cobranza</h2><Link to="/cobranza">Ver todas</Link></div>{alerts.length ? alerts.map(d=>{const [v,l]=urgency(d.fecha_vencimiento); return <div className="compact" key={d.id}><div><b>{d.clientes?.nombre || 'Cliente'}</b><span>{d.tipo} N°{d.numero_documento} · {date(d.fecha_vencimiento)}</span></div><div><b>{clp(d.saldo_pendiente)}</b><Badge variant={v}>{l}</Badge></div></div>}) : <Empty/>}</article><article className="panel"><div className="panel-title"><h2>Próximos eventos</h2><Link to="/calendario">Abrir calendario</Link></div>{nextEvents.length ? nextEvents.map(e=><div className="compact" key={e.id}><div><b>{e.titulo}</b><span>{date(e.fecha)} {e.hora?.slice(0,5)}</span></div><Badge variant={e.tipo}>{e.tipo}</Badge></div>) : <Empty>Sin eventos para hoy ni mañana.</Empty>}</article></section></>
}
