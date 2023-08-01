import React, { useEffect, useState } from 'react';
import { Button, useNotify, useRefresh, useMutation } from 'react-admin';
import { Table, TableBody, TableCell, TableHead, TableRow, Box, Modal, Typography } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { ErrorOutline } from '@material-ui/icons';
import IconCheck from '@material-ui/icons/Check';

import styles from './hooks/useContactListStyles';
import AddFeeButton from './popups/AddFee';
import EditFeeButton from './popups/EditFee';
import AddExpenseButton from './popups/AddExpense';
import EditExpenseButton from './popups/EditExpense';
import EditReportFee from './popups/EditReportFee';

type feeProps = {
  initialFees?: any;
  initialExpenses?: any;
  initialCommissions?: any;
  appraisal?: any;
  clientId: string;
  edit?: boolean;
  delet?: boolean;
};

export function FeeListEditable({
  initialFees,
  initialExpenses,
  initialCommissions,
  appraisal,
  clientId,
  edit = true,
  delet = true,
}: feeProps) {
  const classes = styles();
  const notify = useNotify();
  const refresh = useRefresh();
  const [deleteFeeMutation] = useMutation({ type: 'delete', resource: 'appraisal_fee', payload: {} });
  const [deleteExpenseMutation] = useMutation({
    type: 'delete',
    resource: 'appraisal_expense',
    payload: {},
  });

  const totalExpense = initialExpenses && initialExpenses.appraisal_expense[0]?.appraisal.total_expenses;
  // const commissions = initialCommissions && initialCommissions.appraisal_commissions;
  const [fees, setFees] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [feeType, setFeeType] = useState('');

  const removeFee = async (index: number) => {
    const newFees = [...fees];
    await deleteFee();

    setOpen(false);
    notify('fee.deleted');
    newFees.splice(index, 1);
    setFees(newFees);
    refresh();
  };
  const removeExpense = async (index: number) => {
    const newExpenses = [...expenses];
    await deleteExpense();

    setOpen(false);
    notify('expense.deleted');
    newExpenses.splice(index, 1);
    setExpenses(newExpenses);
    refresh();
  };

  const deleteFee = async () => {
    return new Promise((resolve, reject) => {
      deleteFeeMutation(
        {
          payload: {
            id: selected,
            data: {},
          },
        },
        {
          onSuccess: ({ data }: any) => {
            resolve(data);
          },
          onFailure: ({ error }: any) => {
            notify(error.message, 'error');
            reject(error);
          },
        },
      );
    });
  };
  const deleteExpense = async () => {
    return new Promise((resolve, reject) => {
      deleteExpenseMutation(
        {
          payload: {
            id: selected,
            data: {},
          },
        },
        {
          onSuccess: ({ data }: any) => {
            resolve(data);
          },
          onFailure: ({ error }: any) => {
            notify(error.message, 'error');
            reject(error);
          },
        },
      );
    });
  };

  useEffect(() => {
    setFees(initialFees?.appraisal_fee);
    setExpenses(initialExpenses?.appraisal_expense);
  }, [initialFees, initialExpenses]);

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(!open)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box className={classes.paper}>
          <Typography classes={{ root: classes.heading }}>
            Remove {`${feeType === 'fee' ? 'Fee' : 'Expense'}`}
          </Typography>
          <p>Are you sure you want to remove this {`${feeType === 'fee' ? 'fee' : 'expense'}`}?</p>
          <Box className={classes.confirmBtnBox}>
            <Button
              onClick={() => setOpen(false)}
              label="Cancel"
              color="secondary"
              startIcon={<ErrorOutline />}
            ></Button>
            {feeType === 'fee' ? (
              <Button
                onClick={() => removeFee(fees.findIndex((item: any) => item.id === selected))}
                label="Confirm"
                color="primary"
                startIcon={<IconCheck />}
              ></Button>
            ) : (
              <Button
                onClick={() => removeExpense(expenses.findIndex((item: any) => item.id === selected))}
                label="Confirm"
                color="primary"
                startIcon={<IconCheck />}
              ></Button>
            )}
          </Box>
        </Box>
      </Modal>

      {/* FeeTable */}
      <Table>
        <TableHead classes={{ root: classes.tableHead }}>
          <TableRow>
            <TableCell
              classes={{
                root: classes.headFixedCell,
              }}
            >
              FEE
            </TableCell>
            <TableCell
              classes={{
                root: classes.headCell,
              }}
            >
              QTY./PERC.
            </TableCell>
            <TableCell
              classes={{
                root: classes.headCell,
              }}
            >
              RATE
            </TableCell>
            <TableCell
              classes={{
                root: classes.headCell,
              }}
            >
              TOTAL
            </TableCell>
            <TableCell classes={{ root: classes.cellEdit }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
              Report Fee
            </TableCell>
            <TableCell classes={{ root: classes.cell }}>1</TableCell>
            <TableCell classes={{ root: classes.cell }}>${appraisal?.report_fee}</TableCell>
            <TableCell classes={{ root: classes.cell }}>${appraisal?.report_fee.toFixed(2)}</TableCell>
            <TableCell classes={{ root: classes.cell }}>
              <Box className={classes.savedCell}>
                {edit && (
                  <span className={classes.iconPadding}>
                    <EditReportFee appraisal={appraisal} />
                  </span>
                )}
              </Box>
            </TableCell>
          </TableRow>

          {fees?.length !== 0 &&
            fees?.map((row: any, i: number) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                  {row.description}
                </TableCell>
                <TableCell classes={{ root: classes.cell }}>
                  {row.rate_type_id === 1 ? `${(row.rate * 100).toFixed(0)}%` : row.quantity}
                </TableCell>
                <TableCell classes={{ root: classes.cell }}>{row.rate_type_id === 1 ? '' : `$${row.rate}`}</TableCell>
                <TableCell classes={{ root: classes.cell }}>${row.total_amount.toFixed(2)}</TableCell>
                <TableCell classes={{ root: classes.cell }}>
                  <Box className={classes.savedCell}>
                    {edit && (
                      <span className={classes.iconPadding}>
                        <EditFeeButton currentFee={row} appraisal={appraisal} />
                      </span>
                    )}
                    {delet && (
                      <span>
                        <Icon
                          classes={{ root: classes.activeCursor }}
                          fontSize="small"
                          onClick={() => {
                            setSelected((fees[i] as any)['id']);
                            setOpen(true);
                            setFeeType('fee');
                          }}
                        >
                          close
                        </Icon>
                      </span>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell
              component="th"
              scope="row"
              classes={{
                root: classes.cellBottom,
              }}
            >
              TOTAL FEES
            </TableCell>
            <TableCell
              classes={{
                root: classes.cellBottom,
              }}
            ></TableCell>
            <TableCell
              classes={{
                root: classes.cellBottom,
              }}
            ></TableCell>
            <TableCell
              classes={{
                root: classes.cellBottom,
              }}
            >
              ${appraisal?.total_fees.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Box className={classes.addFeeBox}>
        <p className={classes.note}>
          Note: Total Fees are what's billed to the Client and used when generating an Invoice
        </p>
        {(edit || delet) && (
          <Box className={classes.addContactBtn}>
            <AddFeeButton label="ADD FEE" appraisal={appraisal} clientId={clientId} />
          </Box>
        )}
      </Box>

      {/* Expense Table */}
      {expenses?.length !== 0 && (
        <Table>
          <TableHead classes={{ root: classes.tableHead }}>
            <TableRow>
              <TableCell classes={{ root: classes.headFixedCell }}>EXPENSE</TableCell>
              <TableCell classes={{ root: classes.headCell }}>QTY./PERC.</TableCell>
              <TableCell classes={{ root: classes.headCell }}>RATE</TableCell>
              <TableCell classes={{ root: classes.headCell }}>TOTAL</TableCell>
              <TableCell classes={{ root: classes.cellEdit }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses?.map((row: any, i: number) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                  {row.description}
                </TableCell>
                <TableCell classes={{ root: classes.cell }}>
                  {row.rate_type_id === 1 ? `${(row.rate * 100).toFixed(0)}%` : row.quantity}
                </TableCell>
                <TableCell classes={{ root: classes.cell }}>{row.rate_type_id === 1 ? '' : `$${row.rate}`}</TableCell>
                <TableCell classes={{ root: classes.cell }}>${row.total_amount.toFixed(2)}</TableCell>
                <TableCell classes={{ root: classes.cell }}>
                  <Box className={classes.savedCell}>
                    {edit && (
                      <span className={classes.iconPadding}>
                        <EditExpenseButton currentExpense={row} appraisal={appraisal} />
                      </span>
                    )}
                    {delet && (
                      <span>
                        <Icon
                          classes={{ root: classes.activeCursor }}
                          fontSize="small"
                          onClick={() => {
                            setSelected((expenses[i] as any)['id']);
                            setOpen(true);
                            setFeeType('expense');
                          }}
                        >
                          close
                        </Icon>
                      </span>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cellBottom }}>
                TOTAL EXPENSES
              </TableCell>
              <TableCell classes={{ root: classes.cellBottom }}></TableCell>
              <TableCell classes={{ root: classes.cellBottom }}></TableCell>
              <TableCell classes={{ root: classes.cellBottom }}>${totalExpense?.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      <Box className={classes.addFeeBox}>
        <p className={classes.note}>
          Note: Expenses are used for internal tracking purposes and not billed to the Client
        </p>
        {(edit || delet) && (
          <Box className={classes.addContactBtn}>
            <AddExpenseButton appraisal={appraisal} clientId={clientId} />
          </Box>
        )}
      </Box>

      {/* Commission Table */}
      {/* {commissions?.length !== 0 && (
        <>
          <Table>
            <TableHead classes={{ root: classes.tableHead }}>
              <TableRow>
                <TableCell classes={{ root: classes.headFixedCell }}>COMMISSION</TableCell>
                <TableCell classes={{ root: classes.headCell }}>QTY./PERC.</TableCell>
                <TableCell classes={{ root: classes.headCell }}>RATE</TableCell>
                <TableCell classes={{ root: classes.headCell }}>TOTAL</TableCell>
                <TableCell classes={{ root: classes.headCell }}>STATUS</TableCell>
                <TableCell classes={{ root: classes.cellEdit }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commissions?.map((row: any, i: number) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                    {row.assignee_full_name}({row.assignee_role})
                  </TableCell>
                  <TableCell classes={{ root: classes.cell }}>
                    {row.rate_type_id === 1 ? `${row.rate * 100}%` : row.quantity}
                  </TableCell>
                  <TableCell classes={{ root: classes.cell }}>${row.rate}</TableCell>
                  <TableCell classes={{ root: classes.cell }}>${row.total_amount}</TableCell>
                  <TableCell classes={{ root: classes.cell }}>{row.paid_date ? row.paid_date : 'Unpaid'}</TableCell>
                  <TableCell classes={{ root: classes.cell }}>
                    <Box className={classes.savedCell}>{edit && <EditExpenseButton currentExpense={row} />}</Box>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell component="th" scope="row" classes={{ root: classes.cellBottom }}>
                  TOTAL COMMISSIONS
                </TableCell>
                <TableCell classes={{ root: classes.cellBottom }}></TableCell>
                <TableCell classes={{ root: classes.cellBottom }}></TableCell>
                <TableCell classes={{ root: classes.cellBottom }}></TableCell>
                <TableCell classes={{ root: classes.cellBottom }}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box className={classes.addFeeBox}>
            <p className={classes.note}>
              Note: Commissions can be calculated based on Gross or Next Expenses, or a Flat fee
            </p>
            <Box className={classes.addContactBtn}>
              <AddExpenseButton appraisal={appraisal} clientId={clientId} />
            </Box>
          </Box>
        </>
      )} */}
    </>
  );
}

export default FeeListEditable;
