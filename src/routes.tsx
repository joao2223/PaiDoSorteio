import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './authContext';
import Admin from './pages/Admin';
import Compra from './pages/Compra';
import ConfigAdmin from './pages/ConfigAdmin';
import Consulta from './pages/Consulta';
import Inicio from "./pages/Inicio";
import Pagamento from './pages/Pagamento';
import PedidosAdmin from './pages/PedidosAdmin';
import RifasAdmin from './pages/RifasAdmin';

export default function AppRouter() {
    const { isLoggedIn } = useAuth();
    
    return (
        <main>
            <Router>
                <Routes>
                    <Route index path='/' element={<Inicio />} />
                    <Route path='/compra/:id' element={<Compra />} />

                    <Route path='/admin' element={<Admin />} />
                    <Route path='/admin/rifas' element={isLoggedIn ? <RifasAdmin /> : <Navigate to="/admin" />} />
                    <Route path='/admin/pedidos' element={isLoggedIn ? <PedidosAdmin /> : <Navigate to="/admin" />} />
                    <Route path='/admin/configuracoes' element={isLoggedIn ? <ConfigAdmin /> : <Navigate to="/admin" />} />
                    
                    <Route path='/consulta' element={<Consulta />} />
                    <Route path="/paginaPagamento/:clientId" element={<Pagamento />} />
                </Routes>
            </Router>
        </main>
    )
}