import { MdRemoveRedEye } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import { truncateText } from "../../utils/truncateText";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

const NoteItems = ({ parsedContent, id }) => {
  return (
    <div className="sm:px-5 px-2 py-5 shadow-md bg-noteColor shadow-slate-700 rounded-lg min-h-96 max-h-96 relative overflow-hidden ">
      <p
        className="text-slate-900 ql-editor"
        dangerouslySetInnerHTML={{ __html: truncateText(parsedContent) }}
      ></p>
      <div className="flex justify-between items-center  absolute bottom-5 sm:px-5 px-2 left-0 w-full">
        <span> 21 May, 2021</span>
        <Link to={`/notes/${id}`}>
          {" "}
          <Tooltip title="View Note">
            <IconButton>
              <MdRemoveRedEye className="text-slate-700" />
            </IconButton>
          </Tooltip>
        </Link>
      </div>
    </div>
  );
};

export default NoteItems;
