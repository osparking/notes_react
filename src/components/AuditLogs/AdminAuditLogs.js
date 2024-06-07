import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Blocks } from "react-loader-spinner";
import toast from "react-hot-toast";
import { auditLogsTruncateTexts } from "../../utils/truncateText.js";
import Errors from "../Errors.js";
import moment from "moment";
import { MdDateRange } from "react-icons/md";

//Material ui data grid has used for the table
//initialize the columns for the tables and (field) value is used to show data in a specific column dynamically
export const auditLogcolumns = [
  {
    field: "actions",
    headerName: "Action",
    width: 150,
    editable: false,
    headerClassName: "text-slate-800 text-tablehHeaderText ",
    cellClassName: "text-black  border",
    renderHeader: (params) => <span>Action</span>,
  },

  {
    field: "username",
    headerName: "UserName",
    width: 150,
    editable: false,
    headerClassName: "text-slate-800 text-tablehHeaderText",
    cellClassName: "text-black font-semibold  border",
    renderHeader: (params) => <span>UserName</span>,
  },

  {
    field: "timestamp",
    headerName: "TimeStamp",
    width: 150,
    editable: false,
    headerClassName: "text-slate-800 text-tablehHeaderText",
    cellClassName: "text-black  border  ",
    renderHeader: (params) => <span>TimeStamp</span>,
    renderCell: (params) => {
      console.log(params);
      return (
        <div className=" flex  items-center  gap-1 ">
          <span>
            <MdDateRange className="text-slate-700 text-lg" />
          </span>
          <span>{params?.row?.timestamp}</span>
        </div>
      );
    },
  },
  {
    field: "noteid",
    headerName: "NoteId",
    width: 100,
    editable: false,
    headerClassName: "text-slate-800 text-tablehHeaderText",
    cellClassName: "text-black  border ",
    renderHeader: (params) => <span>NoteId</span>,
  },
  {
    field: "note",
    headerName: "Note Content",
    width: 240,
    editable: false,
    headerClassName: "text-slate-800 text-tablehHeaderText",
    cellClassName: "text-black border",
    renderHeader: (params) => <span>Note Content</span>,
    renderCell: (params) => {
      const contens = JSON.parse(params?.value)?.content;

      const response = auditLogsTruncateTexts(contens);

      return <p className=" text-black   ">{response}</p>;
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 100,
    editable: false,
    headerClassName: "text-slate-800 text-tablehHeaderText",
    cellClassName: "text-black  ",
    sortable: false,

    renderHeader: (params) => <span>Action</span>,
    renderCell: (params) => {
      console.log(params);
      return (
        <Link
          to={`/admin/audit-logs/${params.row.noteId}`}
          className="h-full flex  items-center   "
        >
          <button className="bg-btnColor text-white px-4 flex justify-center items-center  h-9 rounded-md ">
            Views
          </button>
        </Link>
      );
    },
  },
];

const AdminAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(auditLogs);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/audit");
      setAuditLogs(response.data);
    } catch (err) {
      setError(err?.response?.data?.message);
      toast.error("Error fetching audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const rows = auditLogs.map((item) => {
    //format the time bu using moment npm package
    const formattedDate = moment(item.timestamp).format("D MMMM YYYY");

    //set the data for each rows in the table according to the field name in columns
    //Example: username is the keyword in row it should matche with the field name in column so that the data will show on that column dynamically
    return {
      id: item.id,
      noteId: item.noteId,
      actions: item.action,
      username: item.username,
      timestamp: formattedDate,
      noteid: item.noteId,
      note: item.noteContent,
    };
  });

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="p-4">
      <div className="py-4">
        <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
          Audit Logs
        </h1>
      </div>
      {loading ? (
        <>
          {" "}
          <div className="flex  flex-col justify-center items-center  h-72">
            <span>
              <Blocks
                height="70"
                width="70"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
              />
            </span>
            <span>Please wait...</span>
          </div>
        </>
      ) : (
        <>
          {" "}
          <div className="overflow-x-auto w-full mx-auto">
            <DataGrid
              className="w-fit mx-auto px-0"
              rows={rows}
              columns={auditLogcolumns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 6,
                  },
                },
              }}
              pageSizeOptions={[6]}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAuditLogs;
