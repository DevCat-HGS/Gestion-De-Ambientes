import { useQuery } from '@tanstack/react-query';
import { ambientes, dispositivos, instructores, jornadas } from '../lib/api';
import { LayoutDashboard, Monitor, Cpu, Users, Calendar } from 'lucide-react';

export function DashboardPage() {
  const { data: ambientesData } = useQuery({
    queryKey: ['ambientes'],
    queryFn: () => ambientes.getAll(),
  });

  const { data: dispositivosData } = useQuery({
    queryKey: ['dispositivos'],
    queryFn: () => dispositivos.getAll(),
  });

  const { data: instructoresData } = useQuery({
    queryKey: ['instructores'],
    queryFn: () => instructores.getAll(),
  });

  const { data: jornadasData } = useQuery({
    queryKey: ['jornadas'],
    queryFn: () => jornadas.getAll(),
  });

  const stats = [
    {
      name: 'Total Ambientes',
      value: ambientesData?.data?.length || 0,
      icon: Monitor,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Dispositivos',
      value: dispositivosData?.data?.length || 0,
      icon: Cpu,
      color: 'bg-green-500',
    },
    {
      name: 'Total Instructores',
      value: instructoresData?.data?.length || 0,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      name: 'Jornadas Activas',
      value: jornadasData?.data?.length || 0,
      icon: Calendar,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <LayoutDashboard className="h-6 w-6 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon
                    className={`h-6 w-6 text-white p-1 rounded-md ${stat.color}`}
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Dispositivos por Estado
          </h2>
          <div className="space-y-4">
            {['Funcional', 'En Reparación', 'Dañado'].map((estado) => {
              const count =
                dispositivosData?.data?.filter((d: any) => d.estado === estado)
                  .length || 0;
              return (
                <div key={estado} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    {estado}
                  </span>
                  <span className="text-sm text-gray-900">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Jornadas Recientes
          </h2>
          <div className="space-y-4">
            {jornadasData?.data?.slice(0, 5).map((jornada: any) => (
              <div
                key={jornada.id_jornada}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {jornada.ambiente_nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(jornada.fecha).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm text-gray-600">{jornada.horario}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}