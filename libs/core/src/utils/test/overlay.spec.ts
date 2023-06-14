import { positionTooltip } from '../overlay';

let mockButton = document.createElement('button');

let mockOverlay = document.createElement('div');

describe('positionTooltip', () => {
  it('returns false if no arguments are defined', async () => {
    expect(positionTooltip({elem: undefined, elemPlacement: undefined, overlay: undefined})).toEqual(undefined);
  })

  it('returns false if no placement is defined', async () => {
    expect(positionTooltip({elem: mockButton, elemPlacement: undefined, overlay: mockOverlay})).toBeFalsy();
  })

  it('positions the overlay to the right of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'right', overlay: mockOverlay});

    expect(mockOverlay.style.top).toEqual('50%');
    expect(mockOverlay.style.left).toEqual('calc(0px + 8px)');
    expect(mockOverlay.style.transform).toEqual('translateY(-50%)');
  })

  it('positions the overlay to the right-start of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'right-start', overlay: mockOverlay});

    expect(mockOverlay.style.top).toEqual('0');
    expect(mockOverlay.style.left).toEqual('calc(0px + 8px)');
    expect(mockOverlay.style.transform).toEqual('translateY(0)');
  })

  it('positions the overlay to the right-end of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'right-end', overlay: mockOverlay});

    expect(mockOverlay.style.bottom).toEqual('0');
    expect(mockOverlay.style.left).toEqual('calc(0px + 8px)');
    expect(mockOverlay.style.top).toEqual('initial');
    expect(mockOverlay.style.transform).toEqual('translateY(0)');
  })

  it('positions the overlay to the left of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'left', overlay: mockOverlay});

    expect(mockOverlay.style.top).toEqual('50%');
    expect(mockOverlay.style.right).toEqual('calc(0px + 8px)');
    expect(mockOverlay.style.transform).toEqual('translateY(-50%)');
  })

  it('positions the overlay to the left-start of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'left-start', overlay: mockOverlay});

    expect(mockOverlay.style.right).toEqual('calc(0px + 8px)');
    expect(mockOverlay.style.top).toEqual('0');
    expect(mockOverlay.style.transform).toEqual('translateY(0)');
  })

  it('positions the overlay to the left-end of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'left-end', overlay: mockOverlay});

    expect(mockOverlay.style.bottom).toEqual('0');
    expect(mockOverlay.style.right).toEqual('calc(0px + 8px)');
    expect(mockOverlay.style.top).toEqual('initial');
    expect(mockOverlay.style.transform).toEqual('translateY(0)');
  })

  it('positions the overlay to the bottom of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'bottom', overlay: mockOverlay});

    expect(mockOverlay.style.top).toEqual('calc(0px + 8px)');
    expect(mockOverlay.style.left).toEqual('50%');
    expect(mockOverlay.style.transform).toEqual('translateX(-50%)');
  })

  it('positions the overlay to the bottom-start of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'bottom-start', overlay: mockOverlay});

    expect(mockOverlay.style.left).toEqual('0');
    expect(mockOverlay.style.top).toEqual('calc(0px + 8px)');
    expect(mockOverlay.style.transform).toEqual('translateX(0)');
  })

  it('positions the overlay to the bottom-end of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'bottom-end', overlay: mockOverlay});

    expect(mockOverlay.style.left).toEqual('initial');
    expect(mockOverlay.style.right).toEqual('0');
    expect(mockOverlay.style.top).toEqual('calc(0px + 8px)');
    expect(mockOverlay.style.transform).toEqual('translateX(0)');
  })

  it('positions the overlay to the top of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'top', overlay: mockOverlay});

    expect(mockOverlay.style.top).toEqual('calc((0px + 8px) * -1)');
    expect(mockOverlay.style.left).toEqual('50%');
    expect(mockOverlay.style.transform).toEqual('translateX(-50%)');
  })

  it('positions the overlay to the top-start of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'top-start', overlay: mockOverlay});

    expect(mockOverlay.style.left).toEqual('0');
    expect(mockOverlay.style.top).toEqual('calc((0px + 8px) * -1)');
    expect(mockOverlay.style.transform).toEqual('translateX(0)');
  })

  it('positions the overlay to the top-end of the target', async () => {
    positionTooltip({elem: mockButton, elemPlacement: 'top-end', overlay: mockOverlay});

    expect(mockOverlay.style.left).toEqual('initial');
    expect(mockOverlay.style.right).toEqual('0');
    expect(mockOverlay.style.top).toEqual('calc((0px + 8px) * -1)');
    expect(mockOverlay.style.transform).toEqual('translateX(0)');
  })
});
