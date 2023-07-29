import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Bar from "./Searchbar";
import Menu from "./Menu";
import Nav from "./Navbar";

export default function Home({ database, user }) {
  let databaseCollection = collection(database, "docs-data");
  const [view, setView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [docsData, setDocsData] = useState([]);
  const [fdata, setFdata] = useState([]);
  const defaultRole = { ownedBy: "Owned by anyone" };
  const [selectedFilters, setSelectedFilters] = useState({
    ownedBy: defaultRole,
    currVal: ""
  });
  const [openSettings, setOpenSettings] = useState(false);
  const [authorMenu, setAuthorMenu] = useState(false);
  const owned = [
    defaultRole,
    { ownedBy: "Owned by me" },
    { ownedBy: "Not owned by Me" }
  ];

  let auth = getAuth();
  let navigate = useNavigate();
  const logout = () => {
    signOut(auth).then(() => {
      navigate("/");
    });
  };

  console.log(user, "user");

  useEffect(() => {
    onAuthStateChanged(auth, (response) => {
      if (response) {
        navigate("/home");
      } else {
        navigate("/");
      }
    });
  }, []);

  const addDocument = () => {
    var doctitle;
    doctitle = "Untitled document";

    addDoc(databaseCollection, {
      title: doctitle,
      author: user.name,
      body: "",
      createdAt: serverTimestamp()
    })
      .then((response) => {
        openEditor(response.id);
        toast.success("Document Created", {
          autoClose: 1000
        });
      })
      .catch(() => {
        toast.error("Cannot Add Data", {
          autoClose: 1000
        });
      });
  };

  const deleteDocument = (selected) => {
    const docRef = doc(database, "docs-data", selected.id);

    deleteDoc(docRef)
      .then((response) => {
        toast.success("Document Deleted", {
          autoClose: 1000
        });
      })
      .catch(() => {
        toast.error("Cannot Delete Document", {
          autoClose: 1000
        });
      });
  };

  const openEditor = (id) => {
    navigate(`/editor/${id}`);
  };

  useEffect(() => {
    // createdAt: new Date(doc.createdAt)
    console.log("useffect");
    onSnapshot(databaseCollection, (response) => {
      console.log(response, "docs");
      setDocsData(
        response.docs.map((doc) => {
          // console.log({ ...doc.data(), id: doc.id }, "j");
          return { ...doc.data(), id: doc.id };
        })
      );
      setFdata(
        response.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    });
    setIsLoading(false);
  }, []);

  function filter(obj = selectedFilters) {
    let docArray = docsData;

    if (obj.ownedBy.ownedBy === "Owned by me") {
      docArray = docsData.filter((elem) => elem.author === user.name);
      setFdata(docArray);
    }

    if (obj.ownedBy.ownedBy === "Owned by anyone") {
      docArray = docsData;
      setFdata(docArray);
    }

    if (obj.ownedBy.ownedBy === "Not owned by Me") {
      docArray = docsData.filter((elem) => elem.author !== user.name);
      setFdata(docArray);
    }

    if (obj.currVal !== "") {
      docArray = docsData.filter(
        (elem) =>
          elem.title.toLowerCase().indexOf(obj.currVal.toLowerCase()) > -1
      );
      setFdata(docArray);
    }
    setFdata(docArray);
    // return docArray;
  }

  function handleauthor(newauthor) {
    setSelectedFilters({ ...selectedFilters, ownedBy: newauthor });
    filter({ ...selectedFilters, ownedBy: newauthor });
  }

  function handleSearch(e) {
    setSelectedFilters({ ...selectedFilters, currVal: e.target.value });
    filter({ ...selectedFilters, currVal: e.target.value });
  }

  return (
    <div>
      <ToastContainer />
      <Nav>
        <Bar handleSearch={handleSearch} selectedFilters={selectedFilters} />
        <UserMenu
          user={user}
          logout={logout}
          openSettings={openSettings}
          setOpenSettings={setOpenSettings}
        />
      </Nav>

      <section className="blankdocs-section">
        <section className="docs-container">
          <div className="Heading-conatiners">
            <h3>Start a new document</h3>
            <h3>Template gallery</h3>
          </div>
          <article className="flex gap-20">
            <span className="title-input flex-col">
              <button className="new-docs add-btn" onClick={addDocument}>
                Add
              </button>
              <span>Blank</span>
            </span>
            <span className="flex gap-20 templates">
              <span className="title-input flex-col">
                <span className="new-docs">l</span>
                <span>Blank</span>
              </span>
              <span className="title-input flex-col">
                <span className="new-docs">l</span>
                <span>Blank</span>
              </span>
              <span className="title-input flex-col">
                <span className="new-docs">l</span>
                <span>Blank</span>
              </span>
              <span className="title-input flex-col">
                <span className="new-docs">l</span>
                <span>Blank</span>
              </span>
            </span>
            <div className="Overlay">Coming Soon</div>
          </article>
        </section>
      </section>

      <section className="docs-container">
        <div className="Heading-conatiners">
          <h3>Recent documents</h3>
          <span
            onClick={(e) => {
              e.stopPropagation();
              setAuthorMenu(!authorMenu);
            }}
            className="pointer"
          >
            {selectedFilters.ownedBy.ownedBy}
            {authorMenu && (
              <Menu
                classStyle="menu2"
                hideShowMenu={() => setAuthorMenu(false)}
              >
                {owned.map((ow, index) => {
                  return (
                    <span
                      key={index}
                      onClick={() => {
                        handleauthor(ow);
                      }}
                    >
                      {ow.ownedBy}
                      {selectedFilters.ownedBy.ownedBy === ow.ownedBy
                        ? "?"
                        : ""}
                    </span>
                  );
                })}
              </Menu>
            )}
          </span>
          <span onClick={() => setView(!view)} className="pointer">
            new
          </span>
        </div>

        {isLoading ? (
          <div>Loading.....</div>
        ) : (
          <div className={view ? "table-view" : "grid-main"}>
            {fdata.map((doc) => {
              return (
                <SingleDoc
                  deleteDocument={deleteDocument}
                  openEditor={openEditor}
                  view={view}
                  user={user}
                  doc={doc}
                  key={doc.id}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

const SingleDoc = (props) => {
  const [openDocMenu, setOpenDocMenu] = useState(false);
  const [fulldate, setFulldate] = useState("");
  useEffect(() => {
    console.log(props.doc?.createdAt, "rooo");
    const a = props.doc?.createdAt["seconds"];
    console.log(a, "sh");
    var myDate = new Date(a * 1000);
    var created = myDate.toGMTString();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    console.log(created);
    var date = new Date(created).getDate();
    var time = new Date(created).getMonth() + 1;
    var month = monthNames[time];
    var year = new Date(created).getFullYear();
    var full = month + " " + date + ", " + year;
    console.log(full, "sh");
    setFulldate(full);
  }, []);

  return props.view ? (
    <section
      className="table-child"
      onClick={() => props.openEditor(props.doc.id)}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/2991/2991106.png"
        width="20px"
        alt="logo"
        style={{ marginRight: "20px" }}
      />
      <h3 className="width-45">{props.doc.title}</h3>

      <span style={{ flex: "4" }}>
        {props.doc.author === props.user.name ? "Me" : props.doc.author}
      </span>
      <span style={{ flex: "4" }}>{fulldate}</span>
      <span
        className="doc-options"
        onClick={(e) => {
          e.stopPropagation();
          setOpenDocMenu(true);
        }}
      >
        :
      </span>

      {openDocMenu && (
        <Menu hideShowMenu={() => setOpenDocMenu(false)}>
          <span
            onClick={(e) => {
              e.stopPropagation();
              props.deleteDocument(props.doc);
            }}
          >
            @
          </span>
        </Menu>
      )}
    </section>
  ) : (
    <section
      className="grid-child"
      onClick={() => props.openEditor(props.doc.id)}
    >
      <h3 className="flex gap-20 width-100">{props.doc.title}</h3>

      <p className="doc-details flex-ac flex-sb">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2991/2991106.png"
          width="20px"
          alt="logo"
        />
        <span style={{ fontSize: "12px" }}>Created {fulldate}</span>
        <span
          className="doc-options"
          onClick={(e) => {
            e.stopPropagation();
            setOpenDocMenu(true);
          }}
        >
          :
        </span>
      </p>

      {openDocMenu && (
        <Menu hideShowMenu={() => setOpenDocMenu(false)}>
          <span
            onClick={(e) => {
              e.stopPropagation();
              props.deleteDocument(props.doc);
            }}
          >
            @
          </span>
        </Menu>
      )}
    </section>
  );
};

const UserMenu = ({ user, logout, openSettings, setOpenSettings }) => {
  return (
    <div className="logout-container width-20 flex-ac flex-je">
      <span
        className={
          openSettings
            ? "pointer relative logo-box-active"
            : "pointer relative logo-box"
        }
        onClick={(e) => {
          e.stopPropagation();
          setOpenSettings(!openSettings);
        }}
      >
        <img src={user?.icon} alt="user-icon" />
      </span>
      {openSettings && (
        <Menu
          hideShowMenu={() => {
            setOpenSettings(false);
          }}
          classStyle="menu menu1"
        >
          <span className="flex-ac">
            <span className="user-detail-icon">
              <img src={user?.icon} alt="user-icon" />
            </span>
            <span className="user-details">
              <span className="user-name">{user?.name}</span>
              <br />
              <span className="user-email">{user?.email}</span>
            </span>
          </span>
          <button className="logout-btn" onClick={logout}>
            Sign&nbsp;Out
          </button>
        </Menu>
      )}
    </div>
  );
};
