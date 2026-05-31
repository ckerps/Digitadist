import { GET, POST } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Usuarios API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/usuarios', () => {
    it('debería retornar 200 y una lista de usuarios', async () => {
      const mockUsuarios = [
        { 
          id: 1, 
          nombre: 'Juan', 
          apellido: 'Perez', 
          email: 'juan@test.com', 
          telefono: '1122334455', 
          rol_id: 1, 
          activo: true 
        },
      ];
      prismaMock.usuario.findMany.mockResolvedValue(mockUsuarios as any);
      prismaMock.usuario.count.mockResolvedValue(1);

      const req = new Request('http://localhost/api/usuarios') as any;
      const res = await GET(req);
      
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeDefined();
    });
  });

  describe('POST /api/usuarios', () => {
    it('debería retornar 201 y crear un usuario', async () => {
      const nuevoUsuario = { 
        nombre: 'Maria', 
        apellido: 'Gomez', 
        email: 'maria@test.com', 
        telefono: '1199887766', 
        password: 'password123',
        rol_id: 2, 
        activo: true 
      };
      
      prismaMock.usuario.findUnique.mockResolvedValue(null);
      prismaMock.usuario.create.mockResolvedValue({ id: 2, ...nuevoUsuario } as any);

      const req = new Request('http://localhost/api/usuarios', {
        method: 'POST',
        body: JSON.stringify(nuevoUsuario),
      });

      const res = await POST(req);
      
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.nombre).toBe('Maria');
    });

    it('debería retornar 400 si faltan datos obligatorios', async () => {
      const nuevoUsuario = { nombre: 'Pedro' }; 

      const req = new Request('http://localhost/api/usuarios', {
        method: 'POST',
        body: JSON.stringify(nuevoUsuario),
      });

      const res = await POST(req);
      
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.type).toBe('ValidationError');
    });
  });
});
