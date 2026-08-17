import { describe, expect, it, vi } from 'vitest';
import { ɵcreateSharedLazyLoader } from '@argfit-ui/core';

const runtime = {};

describe('ArgFit chart runtime loader', () => {
  it('shares one in-flight request between concurrent consumers', async () => {
    const importer = vi.fn(async () => runtime);
    const competingImporter = vi.fn(async () => runtime);
    const firstLoader = ɵcreateSharedLazyLoader('chart-runtime-test-concurrency', importer);
    const secondLoader = ɵcreateSharedLazyLoader(
      'chart-runtime-test-concurrency',
      competingImporter,
    );

    const first = firstLoader.load();
    const second = secondLoader.load();

    expect(first).toBe(second);
    await expect(first).resolves.toBe(runtime);
    expect(importer).toHaveBeenCalledTimes(1);
    expect(competingImporter).not.toHaveBeenCalled();
  });

  it('discards a failed request on reset and retries', async () => {
    const importer = vi
      .fn<() => Promise<typeof runtime>>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(runtime);
    const loader = ɵcreateSharedLazyLoader('chart-runtime-test-retry', importer);

    await expect(loader.load()).rejects.toThrow('offline');
    loader.reset();
    await expect(loader.load()).resolves.toBe(runtime);
    expect(importer).toHaveBeenCalledTimes(2);
  });
});
