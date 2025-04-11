import { Database } from "sql.js"
import { useMemo, useState } from "react";

import { Dropdown } from 'primereact/dropdown';
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface DataTableRow
{
    [key: string]: string | number;
}

const tableNameColumn = "tbl_name";
export default function DatabaseTable({ db }: Readonly<{ db: Database | undefined }>) {

    const [tableNames, setTableNames] = useState<string[] | undefined>([]);
    const [selectedTable, setSelectedTable] = useState<string>();
    const [currentData, setCurrentData] = useState<DataTableRow[]>();
    const [currentColumns, setCurrentColumns] = useState<string[] | undefined>([]);

    useMemo(() =>
    {
        const tables = db?.exec("SELECT * FROM sqlite_master WHERE type='table';");
        const tableNameIndex = tables?.[0].columns.findIndex(c => c == tableNameColumn);
    
        if (tableNameIndex && tableNameIndex >= 0)
        {
            const tempTableNames = tables?.[0].values.map(v => v[tableNameIndex] as string);
            setTableNames(tempTableNames);
            setSelectedTable(tempTableNames?.[0]);
        }
    }, [db]);

    useMemo(() =>
    {
        if (!selectedTable)
        {
            return;
        }

        const data = db?.exec(`SELECT * FROM ${selectedTable}`);
        if (!data)
        {
            return;
        }

        setCurrentColumns(data[0].columns);

        const tempCurrentData: DataTableRow[] = [];
        data[0].values.forEach((row) => 
        {
            const tempRow: { [key: string]: string | number } = {};
            row.forEach((value, index) =>
            {
                tempRow[data[0].columns[index]] = value as number | string;
            });

            tempCurrentData.push(tempRow);
        });

        setCurrentData(tempCurrentData);

    }, [selectedTable]);

    return (
        <div>
            <Card>
                <div className="w-[300px]">
                    <Dropdown value={selectedTable} onChange={(e) => setSelectedTable(e.value)} options={tableNames} pt={{root: { className: "w-[100%]" }}} />
                </div>
                <div>
                    <DataTable value={currentData} reorderableColumns resizableColumns>
                    {currentColumns?.map((col) => (
                        <Column key={col} field={col} header={col} />
                    ))}
                    </DataTable>
                </div>
            </Card>
        </div>
    );
  }