import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { get, patch, post } from '../api/client'
import { Modal } from '../components/UI'

const eventTypes = [['reunion', 'Reunión'], ['llamada', 'Llamada'], ['cobranza', 'Cobranza'], ['personal', 'Personal']]
const emptyTaskForm = { texto: '', categoria: 'biker', prioridad: 'media', fecha: '' }

export default function Calendario() {
  const [events, setEvents] = useState([])
  const [clients, setClients] = useState([])
  const [editEvent, setEditEvent] = useState(null)
  const [eventForm, setEventForm] = useState(null)
  const [eventSaving, setEventSaving] = useState(false)
  const [eventSaveError, setEventSaveError] = useState('')
  const [newTask, setNewTask] = useState(null)
  const [taskForm, setTaskForm] = useState(emptyTaskForm)
  const [taskSaving, setTaskSaving] = useState(false)
  const [taskSaveError, setTaskSaveError] = useState('')

  const load = () => Promise.all([get('/calendario'), get('/clientes')]).then(([rows, c]) => {
    setEvents(rows.map(e => ({ ...e, title: e.titulo, start: e.fecha + (e.hora ? `T${e.hora}` : ''), classNames: [`event-${e.tipo}`] })))
    setClients(c)
  })
  useEffect(() => { void load() }, [])

  function openEvent(evento) {
    setEditEvent(evento)
    setEventForm({ titulo: evento.titulo, tipo: evento.tipo, fecha: evento.fecha, hora: evento.hora || '' })
    setEventSaveError('')
  }

  async function saveEvent(e) {
    e.preventDefault()
    if (eventSaving) return
    setEventSaving(true)
    setEventSaveError('')
    try {
      await patch(`/calendario/${editEvent.id}`, { ...eventForm, hora: eventForm.hora || null })
      setEditEvent(null)
      await load()
    } catch (err) {
      setEventSaveError(err.response?.data?.detail || 'No fue posible guardar el evento. Inténtalo nuevamente.')
    } finally {
      setEventSaving(false)
    }
  }

  function openNewTask(fecha) {
    setNewTask(true)
    setTaskForm({ ...emptyTaskForm, fecha: fecha || '' })
    setTaskSaveError('')
  }

  async function saveTask(e) {
    e.preventDefault()
    if (taskSaving) return
    setTaskSaving(true)
    setTaskSaveError('')
    const body = { ...taskForm, columna: 'hoy', cliente_id: taskForm.cliente_id || null, fecha: taskForm.fecha || null, hora: taskForm.hora || null }
    try {
      await post('/tareas', body)
      setNewTask(null)
      await load()
    } catch (err) {
      setTaskSaveError(err.response?.data?.detail || 'No fue posible crear la tarea. Inténtalo nuevamente.')
    } finally {
      setTaskSaving(false)
    }
  }

  return (
    <>
      <header><p className="eyebrow">PLANIFICACIÓN</p><h1>Calendario</h1></header>
      <div className="toolbar">
        <button className="primary" onClick={() => openNewTask('')}>+ Nuevo evento/tarea</button>
        <span className="muted">Clic en un día para crear una tarea · clic en un evento para editarlo</span>
      </div>
      <section className="calendar panel">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="es"
          firstDay={1}
          height="auto"
          headerToolbar={{ left: 'prev,next', center: 'title', right: '' }}
          dayHeaderFormat={{ weekday: 'long' }}
          events={events}
          dateClick={arg => openNewTask(arg.dateStr)}
          eventClick={arg => openEvent({ id: arg.event.id, ...arg.event.extendedProps })}
        />
      </section>
      {editEvent && (
        <Modal title="Editar evento" onClose={() => setEditEvent(null)}>
          <form onSubmit={saveEvent}>
            <label>Título<input required value={eventForm.titulo} onChange={e => setEventForm({ ...eventForm, titulo: e.target.value })} /></label>
            <label>Tipo
              <select value={eventForm.tipo} onChange={e => setEventForm({ ...eventForm, tipo: e.target.value })}>
                {eventTypes.map(([v, l]) => <option value={v} key={v}>{l}</option>)}
              </select>
            </label>
            <label>Fecha<input required type="date" value={eventForm.fecha} onChange={e => setEventForm({ ...eventForm, fecha: e.target.value })} /></label>
            <label>Hora<input type="time" value={eventForm.hora} onChange={e => setEventForm({ ...eventForm, hora: e.target.value })} /></label>
            {editEvent.tarea_id && <p className="muted">Este evento está vinculado a una tarea — si la tarea vuelve a sincronizarse, sus datos podrían sobrescribir estos cambios.</p>}
            {editEvent.documento_id && <p className="muted">Este evento está vinculado a un documento de cobranza.</p>}
            {eventSaveError && <p className="notice error">{eventSaveError}</p>}
            <button className="primary" disabled={eventSaving}>{eventSaving ? 'Guardando…' : 'Guardar'}</button>
          </form>
        </Modal>
      )}
      {newTask && (
        <Modal title="Nueva tarea" onClose={() => setNewTask(null)}>
          <form onSubmit={saveTask}>
            <label>Tarea<input required value={taskForm.texto} onChange={e => setTaskForm({ ...taskForm, texto: e.target.value })} /></label>
            <label>Categoría
              <select value={taskForm.categoria} onChange={e => setTaskForm({ ...taskForm, categoria: e.target.value })}>
                <option value="biker">Biker</option>
                <option value="personal">Personal</option>
              </select>
            </label>
            <label>Prioridad
              <select value={taskForm.prioridad} onChange={e => setTaskForm({ ...taskForm, prioridad: e.target.value })}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </label>
            <label>Cliente
              <select value={taskForm.cliente_id || ''} onChange={e => setTaskForm({ ...taskForm, cliente_id: e.target.value })}>
                <option value="">Sin vincular</option>
                {clients.map(c => <option value={c.id} key={c.id}>{c.nombre}</option>)}
              </select>
            </label>
            <label>Fecha<input type="date" value={taskForm.fecha} onChange={e => setTaskForm({ ...taskForm, fecha: e.target.value })} /></label>
            <label>Hora<input type="time" value={taskForm.hora || ''} onChange={e => setTaskForm({ ...taskForm, hora: e.target.value })} /></label>
            {taskSaveError && <p className="notice error">{taskSaveError}</p>}
            <button className="primary" disabled={taskSaving}>{taskSaving ? 'Guardando…' : 'Guardar'}</button>
          </form>
        </Modal>
      )}
    </>
  )
}
