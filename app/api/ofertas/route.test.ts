import { GET, POST } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Ofertas API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/ofertas', () => {
    it('debería retornar 200 y una lista de ofertas', async () => {
      const mockOfertas = [
        { 
          id: 1, 
          producto_id: 1, 
          tipo: 'porcentaje', 
          valor: 10, 
          fecha_inicio: new Date(), 
          fecha_fin: new Date(Date.now() + 86400000), 
          activa: true 
        },
      ];
      prismaMock.oferta.findMany.mockResolvedValue(mockOfertas as any);
      prismaMock.oferta.count.mockResolvedValue(1);

      const req = new Request('http://localhost/api/ofertas') as any;
      const res = await GET(req);
      
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeDefined();
    });
  });

  describe('POST /api/ofertas', () => {
    it('debería retornar 201 y crear una oferta', async () => {
      const nuevaOferta = { 
        producto_id: 1, 
        tipo: 'porcentaje', 
        valor: 15, 
        fecha_inicio: new Date(), 
        fecha_fin: new Date(Date.now() + 86400000), 
        activa: true 
      };
      
      prismaMock.oferta.create.mockResolvedValue({ id: 2, ...nuevaOferta } as any);

      const req = new Request('http://localhost/api/ofertas', {
        method: 'POST',
        body: JSON.stringify(nuevaOferta),
      });

      const res = await POST(req);
      
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.valor).toBe(15);
    });

    it('debería retornar 400 si faltan datos obligatorios', async () => {
      const nuevaOferta = { producto_id: 1 }; 

      const req = new Request('http://localhost/api/ofertas', {
        method: 'POST',
        body: JSON.stringify(nuevaOferta),
      });

      const res = await POST(req);
      
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.type).toBe('ValidationError');
    });
  });
});
