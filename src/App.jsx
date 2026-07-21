import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CuentasPorCobrar from './pages/CuentasPorCobrar'
import Clientes from './pages/Clientes'
import ClienteDetalle from './pages/ClienteDetalle'
import Calendario from './pages/Calendario'

const links = [['/dashboard','▦','Dashboard'],['/cobranza','◉','Cuentas por cobrar'],['/clientes','♙','Clientes'],['/calendario','□','Calendario']]
function Sidebar() { return <aside className="sidebar"><div className="brand">PANEL <b>JEFFERSON</b></div><nav>{links.map(([to,icon,label]) => <NavLink key={to} to={to}><i>{icon}</i><span>{label}</span></NavLink>)}</nav></aside> }
export default function App() { return <div className="shell"><Sidebar/><main><Routes><Route path="/dashboard" element={<Dashboard/>}/><Route path="/cobranza" element={<CuentasPorCobrar/>}/><Route path="/clientes" element={<Clientes/>}/><Route path="/clientes/:id" element={<ClienteDetalle/>}/><Route path="/calendario" element={<Calendario/>}/><Route path="/tareas" element={<Navigate to="/calendario" replace/>}/><Route path="*" element={<Navigate to="/dashboard" replace/>}/></Routes></main></div> }
