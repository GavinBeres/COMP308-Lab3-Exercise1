import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

const GET_POSTS = gql`
  query {
    posts {
      id
      author
      title
      content
      category
      aiSummary
    }
  }
`;

const GET_HELP_REQUESTS = gql`
  query {
    helpRequests {
      id
      author
      description
      location
      isResolved
      volunteers
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($author: String!, $title: String!, $content: String!, $category: String!, $aiSummary: String) {
    createPost(author: $author, title: $title, content: $content, category: $category, aiSummary: $aiSummary) {
      id
      title
      author
      category
    }
  }
`;

const CREATE_HELP_REQUEST = gql`
  mutation CreateHelpRequest($author: String!, $description: String!, $location: String) {
    createHelpRequest(author: $author, description: $description, location: $location) {
      id
      author
      description
      location
      isResolved
    }
  }
`;

function CommunityApp() {
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    category: "news",
    aiSummary: "",
  });

  const [helpForm, setHelpForm] = useState({
    description: "",
    location: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const { data: postsData, refetch: refetchPosts } = useQuery(GET_POSTS);
  const { data: helpData, refetch: refetchHelp } = useQuery(GET_HELP_REQUESTS);

  const [createPost] = useMutation(CREATE_POST);
  const [createHelpRequest] = useMutation(CREATE_HELP_REQUEST);

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first");
      return;
    }

    await createPost({
      variables: {
        author: user.username,
        ...postForm,
      },
    });

    setPostForm({
      title: "",
      content: "",
      category: "news",
      aiSummary: "",
    });

    refetchPosts();
  };

  const handleHelpSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first");
      return;
    }

    await createHelpRequest({
      variables: {
        author: user.username,
        ...helpForm,
      },
    });

    setHelpForm({
      description: "",
      location: "",
    });

    refetchHelp();
  };

  return (
    <div style={{ padding: "20px", color: "black" }}>
      <h2>Community Micro Frontend</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", alignItems: "start" }}>
        <div>
          <h3>Create Post</h3>
          <form onSubmit={handlePostSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              placeholder="Title"
              value={postForm.title}
              onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Content"
              value={postForm.content}
              onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
              required
            />
            <select
              value={postForm.category}
              onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
            >
              <option value="news">News</option>
              <option value="discussion">Discussion</option>
            </select>
            <input
              type="text"
              placeholder="AI Summary (optional)"
              value={postForm.aiSummary}
              onChange={(e) => setPostForm({ ...postForm, aiSummary: e.target.value })}
            />
            <button type="submit">Create Post</button>
          </form>

          <h3 style={{ marginTop: "30px" }}>Create Help Request</h3>
          <form onSubmit={handleHelpSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <textarea
              placeholder="Describe the help needed"
              value={helpForm.description}
              onChange={(e) => setHelpForm({ ...helpForm, description: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={helpForm.location}
              onChange={(e) => setHelpForm({ ...helpForm, location: e.target.value })}
            />
            <button type="submit">Request Help</button>
          </form>
        </div>

        <div>
          <h3>Posts</h3>
          {postsData?.posts?.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <strong>{post.title}</strong>
              <p><b>Author:</b> {post.author}</p>
              <p><b>Category:</b> {post.category}</p>
              <p>{post.content}</p>
              {post.aiSummary && <p><b>AI Summary:</b> {post.aiSummary}</p>}
            </div>
          ))}

          <h3 style={{ marginTop: "30px" }}>Help Requests</h3>
          {helpData?.helpRequests?.map((req) => (
            <div
              key={req.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <p><b>Author:</b> {req.author}</p>
              <p><b>Description:</b> {req.description}</p>
              <p><b>Location:</b> {req.location}</p>
              <p><b>Resolved:</b> {req.isResolved ? "Yes" : "No"}</p>
              <p><b>Volunteers:</b> {req.volunteers?.join(", ") || "None yet"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityApp;