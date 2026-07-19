import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { get } from '../api/client'
import { Modal } from '../components/UI'
export default function Calendario(){const [events,setEvents]=useState([]),[selected,setSelected]=useState(null);useEffect(()=>{get('/calendario').then(rows=>setEvents(rows.map(e=>({...e,title:e.titulo,start:e.fecha+(e.hora?`T${e.hora}`:''),classNames:[`event-${e.tipo}`]}))))},[]);return <><header><p className="eyebrow">PLANIFICACIÓN</p><h1>Calendario</h1></header><section className="calendar panel"><FullCalendar plugins={[dayGridPlugin,interactionPlugin]} initialView="dayGridMonth" locale="es" firstDay={1} height="auto" events={events} eventClick={arg=>setSelected(arg.event.extendedProps)}/></section>{selected&&<Modal title={selected.titulo} onClose={()=>setSelected(null)}><p><b>Fecha:</b> {selected.fecha} {selected.hora?.slice(0,5)}</p><p><b>Tipo:</b> {selected.tipo}</p><p><b>Origen:</b> {selected.origen}</p>{selected.documento_id&&<p>Este evento está vinculado a un documento de cobranza.</p>}{selected.tarea_id&&<p>Este evento está vinculado a una tarea.</p>}</Modal>}</>}
