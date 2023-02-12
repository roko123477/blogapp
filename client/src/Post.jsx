import React, { useContext, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { UserContext } from "./userContext";
import Loader from "./pages/Loader";

const Post = ({ _id, title, summary, images, content, createdAt, author }) => {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useContext(UserContext);
  // console.log(images);
  const handleDeletepost = async () => {
    setLoading(true);
    const response = await fetch(`http://localhost:4000/delete/${_id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      setLoading(false);
      setRedirect(true);
    }
  };

  if (redirect) {
    window.location.reload();
  }
  let isAuthor = false;
  if (userInfo !== null) {
    isAuthor = JSON.stringify(userInfo.id) === JSON.stringify(author._id);
  } else {
    isAuthor = false;
  }
  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="post">
          <div className="image">
            <Link to={`/post/${_id}`}>
              {images.length > 0 && <img src={images[0].url} alt="" />}
            </Link>
          </div>

          <div className="texts">
            <Link to={`/post/${_id}`}>
              <h2>{title}</h2>
            </Link>
            <p className="info">
              <a className="author" href={`/post/${_id}`}>
                By: {author.username}
              </a>
              <time>{format(new Date(createdAt), "MMM d, yyyy HH:mm")}</time>
            </p>
            <p className="summary">{summary}</p>
          </div>
          {isAuthor && <button onClick={handleDeletepost}>Delete Post</button>}
        </div>
      )}
    </>
  );
};

export default Post;
