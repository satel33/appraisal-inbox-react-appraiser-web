import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from './en';

export enum Locale {
  English = 'en',
}

export default polyglotI18nProvider((locale) => {
  switch (locale) {
    default:
      return en;
  }
}, Locale.English);
