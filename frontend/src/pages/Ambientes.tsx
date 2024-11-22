import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ambientes } from '../lib/api';
import { Plus, Pencil, Trash2, Monitor } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AmbienteFormData {
  nombre: string;
  ubicacion: string;
}

export function AmbientesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAmbiente, setEditingAmbiente] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['ambientes'],
    queryFn: () => ambientes.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: AmbienteFormData) => ambientes.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambientes'] });
      setIsOpen(false);
      toast.success('Ambiente created successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AmbienteFormData }) =>
      ambientes.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambientes'] });
      setEditingAmbiente(null);
      toast.success('Ambiente updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ambientes.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambientes'] });
      toast.success('Ambiente deleted successfully');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get('nombre') as string,
      ubicacion: formData.get('ubicacion') as string,
    };

    if (editingAmbiente) {
      updateMutation.mutate({ id: editingAmbiente.id_ambiente, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-semibold text-gray-900">Ambientes</h1>
          <Monitor className="h-6 w-6 text-gray-400" />
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Ambiente
        </button>
      </div>

      {(isOpen || editingAmbiente) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium mb-4">
              {editingAmbiente ? 'Edit Ambiente' : 'New Ambiente'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  defaultValue={editingAmbiente?.nombre}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="ubicacion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ubicación
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  id="ubicacion"
                  defaultValue={editingAmbiente?.ubicacion}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setEditingAmbiente(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingAmbiente ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.data?.map((ambiente: any) => (
              <tr key={ambiente.id_ambiente}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {ambiente.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ambiente.ubicacion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingAmbiente(ambiente)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this ambiente?'
                        )
                      ) {
                        deleteMutation.mutate(ambiente.id_ambiente);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}