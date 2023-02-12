import React, { useState } from "react";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import Loader from './Loader';

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const[loading,setLoading]=useState(false);

  const createNewPost = async (e) => {
    setLoading(true);
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    for(let i = 0; i < files.length; i++){
      data.append("file", files[i]);}
    e.preventDefault();
    console.log(files);
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setLoading(false);
      setRedirect(true);
    }
    console.log(await response.json());
  };
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
    {loading && <Loader />}
    {!loading && (
    <div className="container bs">
    <form onSubmit={createNewPost} encType="multipart/form-data">
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
      <input type="file" onChange={(e) => setFiles(e.target.files)} multiple />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "5px" }}>Create Post</button>
    </form>
    </div>)}
    </>
  );
};

export default CreatePost;
