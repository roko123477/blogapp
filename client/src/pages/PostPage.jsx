import React, { useContext } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { UserContext } from "../userContext";

const PostPage = () => {
  const [postinfo, setPostinfo] = useState(null);
  const { id } = useParams();
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostinfo(postInfo);
      });
    });
  }, []);

  if (!postinfo) return "";
  return (
    <div className="post-page">
      <h1>{postinfo.title}</h1>
      <time>{format(new Date(postinfo.createdAt), "MMM d, yyyy HH:mm")}</time>
      <div className="author">by @{postinfo.author.username}</div>
      {userInfo.id === postinfo.author._id && (
        <div className="edit-row">
          <Link to={`/edit/${postinfo._id}`} className="edit-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Edit this post
          </Link>
        </div>
      )}

      {postinfo.images.map((image, i) => {
        return (
          <div key={i} className="image" style={{margin:"15px"}}>
            <img src={image.url} alt="" />
          </div>
        );
      })}

      <div dangerouslySetInnerHTML={{ __html: postinfo.content }} />
    </div>
  );
};

export default PostPage;
