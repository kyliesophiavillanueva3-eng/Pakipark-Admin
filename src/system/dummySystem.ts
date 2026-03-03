export type DummyRecord = {
  id: string;
  title: string;
  status: 'active' | 'archived';
};

export class DummySystem {
  private readonly records = new Map<string, DummyRecord>();

  constructor(initialRecords: DummyRecord[] = []) {
    initialRecords.forEach((record) => {
      this.records.set(record.id, record);
    });
  }

  list(): DummyRecord[] {
    return Array.from(this.records.values());
  }

  get(id: string): DummyRecord | null {
    return this.records.get(id) ?? null;
  }

  create(record: DummyRecord): DummyRecord {
    this.records.set(record.id, record);
    return record;
  }

  archive(id: string): DummyRecord | null {
    const current = this.records.get(id);
    if (!current) {
      return null;
    }

    const updated: DummyRecord = {
      ...current,
      status: 'archived',
    };
    this.records.set(id, updated);
    return updated;
  }

  remove(id: string): boolean {
    return this.records.delete(id);
  }
}

export const buildDefaultDummySystem = () =>
  new DummySystem([
    { id: '1', title: 'First placeholder item', status: 'active' },
    { id: '2', title: 'Second placeholder item', status: 'active' },
  ]);
