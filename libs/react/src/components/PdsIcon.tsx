import React from 'react';

import { PdsIconInner } from './inner-proxies';

import { createForwardRef } from './react-component-lib/utils';

interface PineReactProps {
  className?: string;
  style?: { [key: string]: any };
}
interface PdsIconProps {
  color?: string;
  icon?: string;
  name?: string;
  size?: string;
}

type InternalProps = PdsIconProps & {
  forwardedRef?: React.ForwardedRef<HTMLPdsIconElement>;
};

class PdsIconContainer extends React.PureComponent<InternalProps> {
  constructor(props: InternalProps) {
    super(props);
    if (this.props.name) {
      console.warn(
        'In Pine React, you import icons from "pineicons" and set the icon you imported to the "name" property. Setting the "name" property has no effect.'
      );
    }
  }

  render() {
    const { icon, name, size, color, ...rest } = this.props;

    return (
      <PdsIconInner ref={this.props.forwardedRef} icon={icon} name={name} {...rest}>
        {this.props.children}
      </PdsIconInner>
    );
  }
}

export const PdsIcon = createForwardRef<PdsIconProps & PineReactProps, HTMLPdsIconElement>(
  PdsIconContainer,
  'PdsIcon'
);
