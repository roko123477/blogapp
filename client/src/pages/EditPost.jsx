import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";


import Editor from "../Editor";
import Loader from "./Loader";

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [images, setImages] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [deletefiles, setDeleteFiles] = useState([]);
  const[loading,setLoading]=useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
        setImages(postInfo.images);
      });
    });
  }, []);

  const updatePost = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    for (let i = 0; i < files.length; i++) {
      data.append("file", files[i]);
    }

    for (let i = 0; i < deletefiles.length; i++) {
      data.append("deletefile", deletefiles[i].filename);
    }
    console.log(deletefiles);
    //  console.log(data);
    const response = await fetch("http://localhost:4000/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setLoading(false);
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }
  const handleClick = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setDeleteFiles([
        ...deletefiles,
        {
          filename: value,
        },
      ]);
    } else {
      let filteredData = deletefiles.filter((data) => data.filename !== value);
      setDeleteFiles(filteredData);
    }
  };
  return (<>
    {loading && <Loader />}
    {!loading &&
    (<div className="container bs">
     
      <form onSubmit={updatePost} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setFiles(e.target.files)}
          multiple
        />
        <Editor onChange={setContent} value={content} />

        <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
          Images you want to remove
        </h2>
        {images.map((image, i) => {
          return (
            <div key={i} className="image" style={{ margin: "15px" }}>
              <label htmlFor={`image-${i}`}>
                <img className="editimg"
                  src={image.url}
                  alt=""
                  
                />
              </label>
              <input
                type="checkbox"
                style={{ width: "auto" }}
                id={`image-${i}`}
                value={image.filename}
                onChange={handleClick}
              />
            </div>
          );
        })}

        <button style={{ marginTop: "5px" }}>Update Post</button>
      </form>
    </div>)}
    </>
  );
};

export default EditPost;
