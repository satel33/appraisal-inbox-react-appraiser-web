import * as React from 'react';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MenuItemLink, MenuProps, useGetIdentity } from 'react-admin';
import SubMenu from './SubMenu';
import Appraisals from 'views/Appraisal';
import Expense from 'views/Expense';
import Properties from 'views/Property';
import Client from 'views/Client';
import Contact from 'views/Contact';
import Team from 'views/Team';
import { useHistory } from 'react-router-dom';
import { FetchMenuCount } from 'views/Appraisal/reducer';
import { menuCountSelector } from 'views/Appraisal/selector';
import Lease from 'views/Transactions/Lease';
import Sales from 'views/Transactions/Sales';
import { useLocation } from 'react-router-dom';
import {
  starredLink,
  inProgressLink,
  inspectionLink,
  pastDueLink,
  rushLink,
  dueSoonLink,
  unpaidLink,
  leaseCompsLink,
  salesCompsLink,
  propertiesLink,
  unscheduledLink,
  appraisalsLink,
  unassignedLink,
  expensesLink,
} from 'shared/constants/menu';
import {
  DueSoonIcon,
  InProgressIcon,
  InspectionIcon,
  PastDueIcon,
  RushIcon,
  ScheduleIcon,
  Starred,
  UnpaidIcon,
  UnscheduledIcon,
  InsightsIcon,
  UnassignedIcon,
  CreditCardIcon,
} from 'shared/constants/icons';
import { checkCanAccessMenu } from 'shared/utils';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

const Menu: FC<MenuProps> = ({ onMenuClick, dense, logout }) => {
  const { identity } = useGetIdentity();
  const history = useHistory();
  const [openedMenus, setOpenedMenus] = useState<string[]>([]);
  const location = useLocation();
  const isXSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));
  const dispatch = useDispatch();
  const menuCounts = useSelector(menuCountSelector);
  const open = useSelector((state: any) => state.admin.ui.sidebarOpen);
  React.useEffect(() => {
    dispatch(FetchMenuCount());
  }, [dispatch]);

  const handleToggle = (menu: string, payload: any) => {
    if (openedMenus.includes(menu)) {
      setOpenedMenus((prev) => prev.filter((e) => e !== menu));
    } else {
      if (payload.pathname !== location.pathname) {
        history.push(payload);
      }
      setOpenedMenus((prev) => prev.concat([menu]));
    }
  };

  return (
    <div>
      {/* <MenuItemLink
        to="/"
        primaryText="Inbox"
        leftIcon={<InboxIcon />}
        onClick={onMenuClick}
        sidebarIsOpen={open}
        dense={dense}
        exact
      /> */}
      <SubMenu
        handleToggle={() => handleToggle('appraisals', inProgressLink)}
        isOpen={openedMenus.includes('appraisals')}
        sidebarIsOpen={open}
        name="Appraisals"
        icon={<Appraisals.icon />}
        dense={dense}
      >
        <MenuItemLink
          to={appraisalsLink}
          leftIcon={<Appraisals.icon />}
          primaryText={`All Appraisals (${menuCounts?.allAppraisals?.aggregate?.count ?? ''})`}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={inProgressLink}
          leftIcon={<InProgressIcon />}
          primaryText={`In Progress (${menuCounts?.inProgress?.aggregate?.count ?? ''})`}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={unassignedLink}
          leftIcon={<UnassignedIcon />}
          primaryText={`Unassigned (${menuCounts?.unassigned?.aggregate?.count ?? ''})`}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={rushLink}
          primaryText={`Rush (${menuCounts?.rush?.aggregate?.count ?? ''})`}
          leftIcon={<RushIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={dueSoonLink}
          leftIcon={<DueSoonIcon />}
          primaryText={`Due Soon (${menuCounts?.dueSoon?.aggregate?.count ?? ''})`}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={inspectionLink}
          primaryText={`Inspections (${menuCounts?.upcomingInspections?.aggregate?.count ?? ''})`}
          leftIcon={<InspectionIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={unscheduledLink}
          primaryText={`Unscheduled (${menuCounts?.unscheduled?.aggregate?.count ?? ''})`}
          leftIcon={<UnscheduledIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={pastDueLink}
          primaryText={`Past Due (${menuCounts?.pastDue?.aggregate?.count ?? ''})`}
          leftIcon={<PastDueIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={unpaidLink}
          primaryText={`Unpaid (${menuCounts?.unpaid?.aggregate?.count ?? ''})`}
          leftIcon={<UnpaidIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={starredLink}
          primaryText={`Starred (${menuCounts?.starred?.aggregate?.count ?? ''})`}
          leftIcon={<Starred />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
      </SubMenu>
      <MenuItemLink
        to="/schedule"
        primaryText="Schedule"
        leftIcon={<ScheduleIcon />}
        onClick={onMenuClick}
        sidebarIsOpen={open}
        dense={dense}
      />
      {/* Hide properties tab: https://trello.com/c/anjuABik/670-property-remove */}
      {false && checkCanAccessMenu(identity?.role, 'properties') && (
        <SubMenu
          handleToggle={() => {
            handleToggle('properties', propertiesLink);
          }}
          isOpen={openedMenus.includes('properties')}
          sidebarIsOpen={open}
          name="Properties"
          icon={<Properties.icon />}
          dense={dense}
        >
          <MenuItemLink
            to={propertiesLink}
            leftIcon={<Properties.icon />}
            primaryText={`All Properties (${menuCounts?.allProperties?.aggregate?.count ?? ''})`}
            onClick={onMenuClick}
            sidebarIsOpen={open}
            dense={dense}
          />
          <MenuItemLink
            to={salesCompsLink}
            leftIcon={<Sales.icon />}
            primaryText={`Sales Comps (${menuCounts?.salesComps?.aggregate?.count ?? ''})`}
            onClick={onMenuClick}
            sidebarIsOpen={open}
            dense={dense}
          />
          <MenuItemLink
            to={leaseCompsLink}
            leftIcon={<Lease.icon />}
            primaryText={`Lease Comps (${menuCounts?.leaseComps?.aggregate?.count ?? ''})`}
            onClick={onMenuClick}
            sidebarIsOpen={open}
            dense={dense}
          />
        </SubMenu>
      )}
      <SubMenu
        handleToggle={() => handleToggle('expenses', expensesLink)}
        isOpen={openedMenus.includes('expenses')}
        sidebarIsOpen={open}
        name="Accounting"
        icon={<Expense.icon />}
        dense={dense}
      >
        <MenuItemLink
          to={`/expenses`}
          leftIcon={<CreditCardIcon />}
          primaryText={`Expenses`}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
      </SubMenu>
      <MenuItemLink
        to="/insights"
        primaryText="Insights"
        leftIcon={<InsightsIcon />}
        onClick={onMenuClick}
        sidebarIsOpen={open}
        dense={dense}
        exact
      />
      {checkCanAccessMenu(identity?.role, 'clients') && (
        <MenuItemLink
          to={`/clients`}
          primaryText={'Clients'}
          leftIcon={<Client.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
      )}
      {checkCanAccessMenu(identity?.role, 'contacts') && (
        <MenuItemLink
          to={`/contacts`}
          primaryText={'Contacts'}
          leftIcon={<Contact.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
      )}
      {checkCanAccessMenu(identity?.role, 'team') && (
        <MenuItemLink
          to={`/team`}
          primaryText={'Team'}
          leftIcon={<Team.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
      )}
      {isXSmall && logout}
    </div>
  );
};

export default Menu;
