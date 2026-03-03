import { buildDefaultDummySystem, DummySystem } from '../src/system/dummySystem';

describe('DummySystem', () => {
  it('loads default records', () => {
    const system = buildDefaultDummySystem();

    const records = system.list();
    expect(records).toHaveLength(2);
    expect(records[0]?.status).toBe('active');
  });

  it('creates and retrieves a record', () => {
    const system = new DummySystem();
    system.create({ id: 'x-1', title: 'Created item', status: 'active' });

    expect(system.get('x-1')).toEqual({
      id: 'x-1',
      title: 'Created item',
      status: 'active',
    });
  });

  it('archives and removes a record', () => {
    const system = new DummySystem([{ id: 'x-2', title: 'To archive', status: 'active' }]);

    const archived = system.archive('x-2');
    expect(archived?.status).toBe('archived');
    expect(system.remove('x-2')).toBe(true);
    expect(system.get('x-2')).toBeNull();
  });
});
