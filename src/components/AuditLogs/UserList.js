import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { Blocks } from "react-loader-spinner";
import Errors from "../Errors.js";
import moment from "moment";
import { Link } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { MdDateRange } from "react-icons/md";

//Material ui data grid has used for the table
//initialize the columns for the tables and (field) value is used to show data in a specific column dynamically
export const userListsColumns = [
  {
    field: "username",
    headerName: "UserName",
    width: 160,
    editable: false,
    headerClassName: "text-slate-800 text-tablehHeaderText ",
    cellClassName: "text-black font-semibold  border",
    renderHeader: (params) => <span>UserName</span>,
  },

  {
    field: "email",
    headerName: "Email",
    width: 220,
    editable: false,
    headerClassName: "text-slate-800 text-tablehHeaderText ",
    cellClassName: "text-black  border  ",
    renderHeader: (params) => <span>Email</span>,
    renderCell: (params) => {
      console.log(params);
      return (
        <div className=" flex  items-center  gap-1 ">
          <span>
            <MdOutlineEmail className="text-slate-700 text-lg" />
          </span>
          <span>{params?.row?.email}</span>
        </div>
      );
    },
  },
  {
    field: "created",
    headerName: "Created At",
    width: 180,
    editable: false,
    headerClassName: "text-slate-800 text-tablehHeaderText ",
    cellClassName: "text-black  border  ",
    renderHeader: (params) => <span>Created At</span>,
    renderCell: (params) => {
      console.log(params);
      return (
        <div className=" flex  items-center  gap-1 ">
          <span>
            <MdDateRange className="text-slate-700 text-lg" />
          </span>
          <span>{params?.row?.created}</span>
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 140,
    editable: false,
    headerClassName: "text-slate-800 text-tablehHeaderText ",
    cellClassName: "text-black  border  ",
    renderHeader: (params) => <span>Status</span>,
  },
  {
    field: "action",
    headerName: "Action",
    editable: false,
    headerClassName: "text-slate-800 text-tablehHeaderText ",
    cellClassName: "text-black  border  ",
    sortable: false,
    width: 100,
    renderHeader: (params) => <span>Action</span>,
    renderCell: (params) => {
      return (
        <Link
          to={`/admin/users/${params.id}`}
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

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/getusers");
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
      } catch (err) {
        setError(err?.response?.data?.message);

        toast.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const rows = users.map((item) => {
    const formattedDate = moment(item.createdDate).format("D MMMM YYYY");

    //set the data for each rows in the table according to the field name in columns
    //Example: username is the keyword in row it should matche with the field name in column so that the data will show on that column dynamically
    return {
      id: item.userId,
      username: item.userName,
      email: item.email,
      created: formattedDate,
      status: item.enabled ? "Active" : "Inactive",
    };
  });

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="p-4">
      <div className="py-4">
        <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
          All Users
        </h1>
      </div>
      <div className="overflow-x-auto w-full mx-auto">
        {loading ? (
          <>
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
            <DataGrid
              className="w-fit mx-auto"
              rows={rows}
              columns={userListsColumns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 6,
                  },
                },
              }}
              pageSizeOptions={[6]}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UserList;
