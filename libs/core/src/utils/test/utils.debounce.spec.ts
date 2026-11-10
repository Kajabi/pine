import type { EventEmitter } from '@stencil/core';
import { cancelDebouncedEvent, debounce, debounceEvent, flushDebouncedEvent } from '../../utils/utils';

describe('debounce utilities', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('runs once with the last arguments after the wait, unless canceled', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced('a');
    debounced('b');
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('b');

    debounced('c');
    debounced.cancel();
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);

    debounced('d');
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenLastCalledWith('d');
  });

  it('drops a pending debounced event emit on cancel', () => {
    const emitter = { emit: jest.fn() } as unknown as EventEmitter;
    const debounced = debounceEvent(emitter, 300);

    debounced.emit({ query: 'tag' });
    cancelDebouncedEvent(debounced);
    jest.advanceTimersByTime(300);
    expect(emitter.emit).not.toHaveBeenCalled();
  });

  it('runs a pending call right away on flush, and does nothing when none is pending', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced.flush();
    expect(fn).not.toHaveBeenCalled();

    debounced('a');
    debounced.flush();
    expect(fn).toHaveBeenCalledWith('a');

    jest.advanceTimersByTime(100);
    debounced.flush();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('keeps a call made from inside a flushed call', () => {
    const calls: string[] = [];
    const debounced = debounce((value: string) => {
      calls.push(value);
      if (value === 'a') debounced('b');
    }, 100);

    debounced('a');
    debounced.flush();
    jest.advanceTimersByTime(100);
    expect(calls).toEqual(['a', 'b']);
  });

  it('sends a pending debounced event emit on flush', () => {
    const emitter = { emit: jest.fn() } as unknown as EventEmitter;
    const debounced = debounceEvent(emitter, 300);

    debounced.emit({ query: 'tag' });
    flushDebouncedEvent(debounced);
    expect(emitter.emit).toHaveBeenCalledWith({ query: 'tag' });

    jest.advanceTimersByTime(300);
    expect(emitter.emit).toHaveBeenCalledTimes(1);
  });

  it('rewraps the original emitter, so only the latest wait applies', () => {
    const emitter = { emit: jest.fn() } as unknown as EventEmitter;
    const rewrapped = debounceEvent(debounceEvent(debounceEvent(emitter, 100), 200), 300);

    rewrapped.emit({ query: 'tag' });
    jest.advanceTimersByTime(300);
    expect(emitter.emit).toHaveBeenCalledTimes(1);
  });

  it('ignores an emitter that was never debounced', () => {
    expect(() => cancelDebouncedEvent({ emit: jest.fn() } as unknown as EventEmitter)).not.toThrow();
    expect(() => cancelDebouncedEvent(undefined)).not.toThrow();
    expect(() => flushDebouncedEvent(undefined)).not.toThrow();
  });
});
