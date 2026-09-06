import type { FC } from 'react';
import { useAuth } from '../context/AuthContext';

const MisHorarios: FC = () => {
    const { nombre } = useAuth();
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const turnos = ['Mañana', 'Tarde', 'Noche'];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.4s ease-out' }}>

            <div style={{ marginBottom: '2rem', borderBottom: '2px solid var(--color-primary, #7a1f3d)', paddingBottom: '1rem' }}>
                <h2 style={{ color: 'var(--color-primary, #7a1f3d)', margin: 0, fontSize: '2rem' }}>📅 Mi Cronograma</h2>
                <p style={{ color: '#666', margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>
                    Vista de lectura asignada al docente: <strong>{nombre}</strong>
                </p>
            </div>

            <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                    <thead>
                    <tr>
                        <th style={{ padding: '1.2rem', backgroundColor: 'var(--color-primary, #7a1f3d)', border: 'none' }}>
                            <span style={{ color: '#ffffff', fontWeight: 'bold', display: 'block', textTransform: 'capitalize' }}>Turno</span>
                        </th>
                        {dias.map(dia => (
                            <th key={dia} style={{ padding: '1.2rem', backgroundColor: 'var(--color-primary, #7a1f3d)', border: 'none' }}>
                                <span style={{ color: '#ffffff', fontWeight: 'bold', display: 'block', textTransform: 'capitalize' }}>{dia}</span>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {turnos.map(turno => (
                        <tr key={turno}>
                            <td style={{ padding: '1.5rem 1rem', borderBottom: '1px solid #eee', fontWeight: 'bold', backgroundColor: '#f8f9fa', color: '#555' }}>
                                {turno}
                            </td>
                            {dias.map(dia => (
                                <td key={`${turno}-${dia}`} style={{ padding: '1.5rem 1rem', borderBottom: '1px solid #eee' }}>
                    <span style={{ color: '#aaa', fontSize: '0.9rem', backgroundColor: '#f5f5f5', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                      Sin asignación
                    </span>
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default MisHorarios;