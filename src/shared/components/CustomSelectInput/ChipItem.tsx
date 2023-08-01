import * as React from 'react';
import { useChoices } from 'ra-core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles({
  root: {
    fontSize: '1rem',
    height: 40,
  },
  label: {
    padding: '0px 24px',
  },
});
const ChipItem = ({
  choice,
  optionText,
  optionValue,
  source,
  translateChoice,
  onChange,
  value: selected,
  disabled,
}: any) => {
  const { getChoiceText, getChoiceValue } = useChoices({
    optionText,
    optionValue,
    translateChoice,
  });
  const label = getChoiceText(choice);
  const value = getChoiceValue(choice);
  const classes = useStyles();

  const nodeId = `${source}_${value}`;
  if (disabled && selected !== value) {
    return null;
  }
  return (
    <Chip
      classes={classes}
      color={selected === value ? 'primary' : 'default'}
      style={{ fontSize: '1rem', height: 40 }}
      id={nodeId}
      onClick={() => {
        if (!disabled) onChange(value);
      }}
      label={label}
    />
  );
};

export default ChipItem;
