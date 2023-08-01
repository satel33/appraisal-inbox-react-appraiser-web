import { View, Text, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import { Record } from 'react-admin';

const styles = StyleSheet.create({
  page: { padding: '10px 0px' },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: { display: 'flex', flexDirection: 'row', borderRight: '1px solid black' },
  headerColumn: {
    borderTop: '1px solid black',
    borderLeft: '1px solid black',
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: '5px 0px',
  },
  noRecords: { display: 'flex', flexDirection: 'row', justifyContent: 'center' },
  column: {
    flex: 1,
    borderTop: '1px solid black',
    borderLeft: '1px solid black',
    textAlign: 'center',
    padding: '5px 0px',
  },
  row: { display: 'flex', flexDirection: 'row' },
  body: {
    borderRight: '1px solid black',
    borderBottom: '1px solid black',
  },
});

type Getter<T> = (arg: T) => string;

type PdfTableProps<T extends Record> = {
  title: string;
  data: T[];
  columns: {
    name: string;
    getter: keyof T | Getter<T>;
  }[];
};

function PdfTable<T extends Record>(props: PdfTableProps<T>) {
  const { data, columns, title } = props;
  if (data.length === 0) return null;
  return (
    <View wrap={false} style={styles.page}>
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.header}>
        {columns.map((e) => (
          <View key={e.name} style={styles.headerColumn}>
            <Text>{e.name}</Text>
          </View>
        ))}
      </View>
      <View>
        {data.length === 0 ? (
          <View style={styles.noRecords}>
            <Text>No records</Text>
          </View>
        ) : (
          <View style={styles.body}>
            {data.map((e) => (
              <View key={e.id} style={styles.row}>
                {columns.map((col) => (
                  <View key={col.name} style={styles.column}>
                    <Text>{typeof col.getter === 'function' ? col.getter(e) : e[col.getter]}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export default PdfTable;
