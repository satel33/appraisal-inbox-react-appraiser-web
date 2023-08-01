import { restrictedMenus } from 'shared/constants/menu';
import { UserRole } from './constants/roles';
import jsonexport from 'jsonexport/dist';
import fileSaver from 'file-saver';
import formatDate from 'date-fns/format';
import pick from 'lodash/pick';
import get from 'lodash/get';
import { groupBy } from 'lodash';
import { isToday, isYesterday } from 'date-fns';

export function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

export const sanitizeRestProps: (props: any) => any = ({
  addLabel,
  allowEmpty,
  basePath,
  cellClassName,
  className,
  emptyText,
  formClassName,
  fullWidth,
  headerClassName,
  label,
  linkType,
  link,
  locale,
  record,
  resource,
  sortable,
  sortBy,
  sortByOrder,
  source,
  textAlign,
  translateChoice,
  ...props
}) => props;

export function getCentroid(points: [number, number][]): [number, number] {
  if (points.length === 1) {
    return points[0];
  }
  const result = points.reduce(
    (acc, [lat, lng]) => {
      const { x, y, z } = acc;
      const latitude = (lat * Math.PI) / 180;
      const longitude = (lng * Math.PI) / 180;
      return {
        x: x + Math.cos(latitude) * Math.cos(longitude),
        y: y + Math.cos(latitude) * Math.sin(longitude),
        z: z + Math.sin(latitude),
      };
    },
    {
      x: 0,
      y: 0,
      z: 0,
    },
  );
  const total = points.length;
  let { x, y, z } = result;
  x = x / total;
  y = y / total;
  z = z / total;
  const centralLongitude = Math.atan2(y, x);
  const centralSquareRoot = Math.sqrt(x * x + y * y);
  const centralLatitude = Math.atan2(z, centralSquareRoot);
  return [(centralLatitude * 180) / Math.PI, (centralLongitude * 180) / Math.PI];
}

export function displayDateIn(dateIn: string) {
  if (['Tomorrow', 'Today', 'Yesterday'].includes(dateIn)) {
    return dateIn;
  }
  if (!dateIn) {
    return '';
  }
  return `In ${dateIn}`;
}

export function formatCurrency(value: number) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  return formatter.format(value ?? 0);
}

export const transform = (obj: any, predicate: (value: any, key: string) => any) => {
  return Object.keys(obj).reduce((memo: any, key: string) => {
    if (predicate(obj[key], key)) {
      memo[key] = obj[key];
    }
    return memo;
  }, {});
};

export function checkCanAccessMenu(role: UserRole, resource: string) {
  const permissions = restrictedMenus[role];
  const resourcePermission = permissions?.[resource];
  if (resourcePermission === undefined) {
    return true;
  }
  if (typeof resourcePermission === 'boolean') {
    return resourcePermission;
  }
  return Boolean(resourcePermission?.list);
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isValidURL(str: string) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

export function incrementFileNumber(fileNumber: string) {
  const matches = fileNumber.match(/\d+/g);
  if (matches?.length) {
    const match = matches?.[matches?.length - 1];
    const integer = parseInt(match) + 1;
    const lastIndex = fileNumber.lastIndexOf(match);
    return fileNumber.replaceAll(match, (match, offset) => {
      if (offset === lastIndex) {
        return `${integer}`;
      }
      return match;
    });
  }
  return '';
}

export function exportCsv<T>(data: T[], fields: string[], filename: string) {
  jsonexport(
    data.map((e) => pick(e, fields)),
    {
      mapHeaders(header) {
        switch (header) {
          case 'location_address':
            return 'address';
          case 'deed_book':
            return 'deed_book_and_page';
          case 'default_role':
            return 'role';
          default:
            return header;
        }
      },
      typeHandlers: {
        Boolean(value) {
          return value ? 'Yes' : 'No';
        },
        String(value, index) {
          const isDateField =
            (typeof index === 'string' && index.includes('_date') && !index.includes('_date_in')) ||
            ['created_at', 'updated_at'].includes(index);
          const isYearField = typeof index === 'string' && index.includes('year_');
          if (isDateField && value) {
            return formatDate(new Date(value), 'MM/dd/yyyy hh:mma');
          }
          if (isYearField) {
            return formatDate(new Date(value), 'yyyy');
          }
          return value;
        },
      },
    },
    (err, csv) => {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      fileSaver.saveAs(blob, `${formatDate(new Date(), 'MM/dd/yyyy')}_${filename}.csv`);
    },
  );
}

export function createExporter(fields: string[], resource: string) {
  return function <T>(data: T[]) {
    exportCsv(data, fields, resource);
  };
}

export function displayFormattedDate(date: string, format = 'MM/dd/yyyy hh:mma') {
  if (!date) {
    return '';
  }
  return formatDate(new Date(date), format);
}

type Getter = (data: any) => string;

export function getOptionValue(value: any, options: any[], getter: Getter | string, optionKey = 'id') {
  const option = Array.isArray(value)
    ? options.filter((e) => value.includes(e[optionKey]))
    : options.find((e) => e[optionKey] === value);

  const getterFn: Getter = (getter === 'function' ? getter : (item) => get(item, getter as string)) as Getter;

  if (Array.isArray(option)) {
    return option.map((e) => getterFn(e)).join(', ');
  }
  if (option) {
    return getterFn(option);
  }
  return '';
}

export const sentaneCase = (value: string) => {
  return value.replace(/\w\S*/g, (txt: string) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const emailValidate = (input: string) => {
  if (!input) return true;
  const regex = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
  );
  return regex.test(input);
};

export const validatePhone = (input: string) => {
  if (!input) return '';
  const regex = new RegExp(
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
  );
  return regex.test(input) ? '' : 'Invalid phone number';
};

export const formatAddress = (input: string) => {
  if (!input) return '';
  const address = input.replaceAll('\n', '').replace(/\s{2,}/g, ' ');
  const addresses = address.split(',');
  const [street] = addresses.map((v: string) => v.trim());
  const restAddress = addresses.slice(1).join(',');
  return `${street},\n${restAddress.trim()}`;
};

let timerId: any = 0;
export const copyToClipboard = (text: string, e: any, edit: boolean) => {
  if (edit || !text) return;
  clearTimeout(timerId);
  const id = 'clipboard-container';
  let found = false;
  if (document.getElementById(id)) found = true;
  const el = document.getElementById(id) || document.createElement('div');
  if (!found) el.setAttribute('id', id);
  el.style.position = 'absolute';
  el.style.display = 'block';
  el.style.zIndex = '100';
  el.style.left = e.pageX - 35 + 'px';
  el.style.top = e.pageY - 35 + 'px';
  el.style.background = 'rgba(0, 0, 0, 0.54)';
  el.style.padding = '6px 8px';
  el.style.color = 'white';
  el.style.fontSize = '11px';
  el.style.borderRadius = '3px';
  el.innerHTML = 'Copied!';
  if (!found) document.body.appendChild(el);
  const textField = document.createElement('textarea');
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
  timerId = setTimeout(() => {
    el.style.display = 'none';
  }, 3000);
};

export const generateDateKey = (date: Date) => {
  if (isToday(date)) {
    return 'TODAY';
  } else if (isYesterday(date)) {
    return 'YESTERDAY';
  } else {
    const formatted = formatDate(date, 'EEEE, MMMM d, YYY');
    return formatted;
  }
};

export const groupDataByDay = (data: any, keyGenerateFunction?: (date: Date) => string, key = 'timestamp_group_by') => {
  const currentDate = new Date();

  return groupBy(data, function (a) {
    const el = {
      ...a,
      date: a[key] ? new Date(a[key]) : currentDate,
    };

    const keyFormat = keyGenerateFunction ? keyGenerateFunction(el.date) : generateDateKey(el.date);
    return keyFormat;
  });
};

export const formatDateForActivity = (dateString: string, showTime: boolean) => {
  const date = new Date(dateString);
  let formattedDate = formatDate(date, 'MMMM d, YYY');

  if (showTime) {
    formattedDate = formatDate(date, 'MMMM d, YYY @ h:mm a');
  }

  return formattedDate;
};
