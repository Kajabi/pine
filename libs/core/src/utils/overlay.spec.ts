import { positionTooltip } from './overlay';

let mockButton = document.createElement('button');

let mockOverlay = document.createElement('div');

describe('positionTooltip', () => {
  it('returns false if no arguments are defined', async () => {
    expect(positionTooltip(undefined, undefined, undefined)).toBeFalsy();
  })

  it('positions the overlay to the right of the target', async () => {
    positionTooltip(mockButton, 'right', mockOverlay);

    expect(mockOverlay.style.top).toEqual('50%');
    expect(mockOverlay.style.left).toEqual('calc(0px + 8px)');
    expect(mockOverlay.style.transform).toEqual('translateY(-50%)');
  })

  it('positions the overlay to the right-start of the target', async () => {
    positionTooltip(mockButton, 'right-start', mockOverlay);

    expect(mockOverlay.style.top).toEqual('0');
    expect(mockOverlay.style.transform).toEqual('translateY(0)');
  })
});
