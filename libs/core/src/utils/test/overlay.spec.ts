import { positionTooltip } from '../overlay';

const mockButton = document.createElement('button');

const mockOverlay = document.createElement('div');

describe('positionTooltip', () => {
  it('returns false if no arguments are defined', async () => {
    expect(positionTooltip({
      elem: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      elemPlacement: undefined as any,
      overlay: null
    })).toBe(false);
  })

  it('returns false if no placement is defined', async () => {
    expect(positionTooltip({
      elem: mockButton,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      elemPlacement: undefined as any,
      overlay: mockOverlay
    })).toBe(false);
  })

  it('positions the overlay to the right of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'right', overlay: mockOverlay});

    expect(mockOverlay.style.top).toEqual('0px');
    expect(mockOverlay.style.left).toEqual('8px');
  })

  it('positions the overlay to the right-start of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'right-start', overlay: mockOverlay});

    expect(mockOverlay.style.top).toEqual('0px');
    expect(mockOverlay.style.left).toEqual('8px');
  })

  it('positions the overlay to the right-end of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'right-end', overlay: mockOverlay});

    expect(mockOverlay.style.left).toEqual('8px');
    expect(mockOverlay.style.top).toEqual('0px');
  })

  it('positions the overlay to the left of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'left', overlay: mockOverlay});

    expect(mockOverlay.style.top).toEqual('0px');
    expect(mockOverlay.style.left).toEqual('-8px');
  })

  it('positions the overlay to the left-start of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'left-start', overlay: mockOverlay});

    expect(mockOverlay.style.left).toEqual('-8px');
    expect(mockOverlay.style.top).toEqual('0px');
  })

  it('positions the overlay to the left-end of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'left-end', overlay: mockOverlay});

    expect(mockOverlay.style.left).toEqual('-8px');
    expect(mockOverlay.style.top).toEqual('0px');
  })

  it('positions the overlay to the bottom of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'bottom', overlay: mockOverlay});

    expect(mockOverlay.style.top).toEqual('8px');
    expect(mockOverlay.style.left).toEqual('0px');
  })

  it('positions the overlay to the bottom-start of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'bottom-start', overlay: mockOverlay});

    expect(mockOverlay.style.left).toEqual('0px');
    expect(mockOverlay.style.top).toEqual('8px');
  })

  it('positions the overlay to the bottom-end of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'bottom-end', overlay: mockOverlay});

    expect(mockOverlay.style.left).toEqual('0px');
    expect(mockOverlay.style.right).toEqual('initial');
    expect(mockOverlay.style.top).toEqual('8px');
  })

  it('positions the overlay to the top of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'top', overlay: mockOverlay});

    expect(mockOverlay.style.top).toEqual('-8px');
    expect(mockOverlay.style.left).toEqual('0px');
  })

  it('positions the overlay to the top-start of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'top-start', overlay: mockOverlay});

    expect(mockOverlay.style.left).toEqual('0px');
    expect(mockOverlay.style.top).toEqual('-8px');
  })

  it('positions the overlay to the top-end of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'top-end', overlay: mockOverlay});

    expect(mockOverlay.style.left).toEqual('0px');
    expect(mockOverlay.style.right).toEqual('initial');
    expect(mockOverlay.style.top).toEqual('-8px');
  })
});
