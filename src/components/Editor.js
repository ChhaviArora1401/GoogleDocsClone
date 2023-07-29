import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Editor({ database }) {
  const [editorData, setEditorData] = useState("");
  const [oldData, setOldData] = useState("");
  const [title, setTitle] = useState("");
  const [oldTitle, setOldTitle] = useState("");
  const [editTitle, setEditTitle] = useState(false);

  let navigate = useNavigate();
  let databaseCollection = collection(database, "docs-data");
  let params = useParams();

  const getEditorData = (value) => {
    setEditorData(value);
  };

  const newTitle = (e) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    if (oldTitle !== title) {
      let docToUpdate = doc(databaseCollection, params.id);

      updateDoc(docToUpdate, {
        title: title
      })
        .then(() => {
          toast.success("Title Updated", {
            autoClose: 1000
          });
        })
        .catch(() => {
          toast.error("Cannot Update Title");
        });
    }
  }, [editTitle]);

  useEffect(() => {
    const updateDocument = setTimeout(() => {
      let docToUpdate = doc(databaseCollection, params.id);
      console.log(params.id, "p");
      if (oldData !== editorData) {
        updateDoc(docToUpdate, {
          body: editorData
        })
          .then(() => {
            toast.success("Document Updated", {
              autoClose: 1000
            });
          })
          .catch(() => {
            toast.error("Cannot Update Document");
          });
      }
    }, 1000);

    return () => clearTimeout(updateDocument);
  }, [editorData]);

  useEffect(() => {
    const document = doc(databaseCollection, params.id);
    onSnapshot(document, (docs) => {
      setTitle(docs.data().title);
      setOldTitle(docs.data().title);
      setEditorData(docs.data().body);
      setOldData(docs.data().body);
    });
  }, []);

  return (
    <div>
      <ToastContainer />
      <div className="flex-ac">
        <span className="logo" onClick={() => navigate("/home")}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2991/2991106.png"
            width="35px"
            alt="logo"
          />{" "}
        </span>
        {editTitle ? (
          <span>
            <input type="text" name="text" value={title} onChange={newTitle} />
            <button onClick={() => setEditTitle(false)}>Save </button>
          </span>
        ) : (
          <h3>
            <span>
              {title}
              <span onClick={() => setEditTitle(true)}>&</span>
            </span>
          </h3>
        )}
      </div>
      <ReactQuill value={editorData} onChange={getEditorData} />
    </div>
  );
}
