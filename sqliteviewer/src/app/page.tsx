"use client";

import "primereact/resources/themes/soho-dark/theme.css"

import { useState } from "react";
import initSQL, { Database } from "sql.js"

import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import DatabaseTable from "@/Components/DatabaseTable";

let sqlJS: initSQL.SqlJsStatic;
initSQL({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  }).then(SQL =>
{
    sqlJS = SQL;
});

export default function Home() {

  const [hasUploadedFile, setUploadedFile] = useState(false);
  const [db, setDB] = useState<Database | undefined>(undefined);

  function onUpload(e: FileUploadHandlerEvent)
  {
    const r = new FileReader();
    r.onload = function() 
    {
      const Uints = new Uint8Array(r.result as ArrayBuffer);
      setDB(new sqlJS.Database(Uints));
      setUploadedFile(true);
    }

    r.readAsArrayBuffer(e.files[0]);
  }

  return (
    <div className="flex mt-[1%] flex-col items-center">
        <div className="w-[50%] min-w-[1280px]">
            <FileUpload name="fileUpload" accept=".db" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} customUpload uploadHandler={onUpload} />
        </div>
        { hasUploadedFile && 
            <div className="w-[50%] min-w-[1280px] mt-[25px]">
                <DatabaseTable db={db} />
            </div>
        }
    </div>
  );
}
