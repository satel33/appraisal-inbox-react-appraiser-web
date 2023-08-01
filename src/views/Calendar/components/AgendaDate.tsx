import React from 'react';
import Typography from '@material-ui/core/Typography';

type AgendaDateProps = {
  label: string;
};
function AgendaDate(props: AgendaDateProps) {
  const { label } = props;
  return <Typography variant="body2">{label}</Typography>;
}
export default AgendaDate;
