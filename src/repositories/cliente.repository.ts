import { Cliente, NuevoCliente } from "@/types/cliente";

const mockClientes: Cliente[] = [
  { id: 3001, tipo: 'razon_social', nombre: 'Acme Corporation', direccion: '123 Industrial Ave', cuit: '30-65432109-7', telefono: '+54 11 4567-1200' },
  { id: 3002, tipo: 'razon_social', nombre: 'Bravo Solutions', direccion: '45 Market St', cuit: '27-12345678-5', telefono: '+54 11 4781-3321' },
  { id: 3003, tipo: 'persona', nombre: 'Carlos Méndez', direccion: '78 Elm Rd', cuit: '20-22334455-8', telefono: '+54 351 422-9088' },
  { id: 3004, tipo: 'razon_social', nombre: 'Delta Retail', direccion: '90 Commerce Blvd', cuit: '30-33445566-2', telefono: '+54 261 433-4422' },
  { id: 3005, tipo: 'razon_social', nombre: 'Echo Enterprises', direccion: '12 Ocean Dr', cuit: '30-55667788-3', telefono: '+54 11 4770-1205' },
  { id: 3006, tipo: 'persona', nombre: 'Florencia Torres', direccion: '67 Digital Way', cuit: '27-33442211-9', telefono: '+54 221 481-0090' },
  { id: 3007, tipo: 'razon_social', nombre: 'Golf Goods Inc.', direccion: '210 Fairway Ln', cuit: '30-87654321-6', telefono: '+54 11 4781-6622' },
  { id: 3008, tipo: 'persona', nombre: 'Hugo Ramírez', direccion: '34 Sunset Blvd', cuit: '20-11223344-5', telefono: '+54 381 433-7711' },
  { id: 3009, tipo: 'razon_social', nombre: 'Indio IT Solutions', direccion: '55 Silicon Rd', cuit: '30-66778899-4', telefono: '+54 11 4593-1188' },
  { id: 3010, tipo: 'persona', nombre: 'Julieta Servetti', direccion: '89 River St', cuit: '27-99887766-1', telefono: '+54 341 425-2210' },
  { id: 3011, tipo: 'razon_social', nombre: 'Kilo Retail Group', direccion: '102 Market St', cuit: '30-44556677-9', telefono: '+54 11 4785-1911' },
  { id: 3012, tipo: 'persona', nombre: 'Lucas Lima', direccion: '12 Garden Ave', cuit: '20-55667788-0', telefono: '+54 261 422-9888' },
  { id: 3013, tipo: 'persona', nombre: 'Miguel Herrero', direccion: '76 Auto Park', cuit: '23-66554433-8', telefono: '+54 11 4750-2277' },
  { id: 3014, tipo: 'razon_social', nombre: 'November Nightlife', direccion: '88 Club Dr', cuit: '30-77889900-5', telefono: '+54 11 4801-2030' },
  { id: 3015, tipo: 'persona', nombre: 'Oscar Ortiz', direccion: '33 Forest Ln', cuit: '20-33445566-1', telefono: '+54 381 440-7122' },
];

export class ClienteRepository {
  static async obtenerTodos(itemsPerPage: number, currentPage: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve({totalPages: Math.ceil(mockClientes.length / itemsPerPage), currentPage: currentPage, clientes: mockClientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), totalItems: mockClientes.length }), 100);
    });
  }

  static async obtenerPorId(id: number): Promise<Cliente | undefined> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockClientes.find(cliente => cliente.id === id)), 100);
    });
  }

  static async crear(data: NuevoCliente) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockClientes[0]), 100);
    });
  }

  static async actualizar(id: number, data: Partial<NuevoCliente>) {
    return new Promise((resolve) => {
        setTimeout(() => resolve({...data, id}), 100);
    });
  }

  static async eliminar(id: number) {
    // Soft delete
    return true
  }
}
