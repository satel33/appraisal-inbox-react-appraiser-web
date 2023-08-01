import React from 'react';
import truncate from 'lodash/truncate';
import { Record, FieldProps } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import ReactResizeDector from 'react-resize-detector';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: '46px',
    minWidth: '150px',
    flexDirection: 'column',
  },
});
type WithLocation = Record & {
  location_address?: string;
};
function AddressField(props: FieldProps<WithLocation>) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const classes = useStyles();
  const address = props.record?.location_address ?? '';
  const addresses = address.split(',');
  const [street] = addresses;
  const restAddress = addresses.slice(1).join(', ');
  return (
    <div ref={ref}>
      <ReactResizeDector targetRef={ref}>
        {({ width }: { width: number; height: number }) => {
          return (
            <div className={classes.root}>
              <span>
                {formatAddress(street, width)}
                {addresses.length > 1 && ','}
              </span>
              <span>{formatAddress(restAddress, width)}</span>
            </div>
          );
        }}
      </ReactResizeDector>
    </div>
  );
}

function formatAddress(address: string, width: number): string {
  if ((width && width > 200) || address.length < 19) {
    return address;
  }
  return truncate(address, { length: 19 });
}

export default AddressField;
