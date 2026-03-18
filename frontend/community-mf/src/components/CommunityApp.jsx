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
    <div style={{ color: "#111827" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "2rem" }}>
        Community Module
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div>
          <div style={sectionCard}>
            <h3 style={sectionTitle}>Create Post</h3>
            <form
              onSubmit={handlePostSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <input
                type="text"
                placeholder="Title"
                value={postForm.title}
                onChange={(e) =>
                  setPostForm({ ...postForm, title: e.target.value })
                }
                required
                style={inputStyle}
              />
              <textarea
                placeholder="Content"
                value={postForm.content}
                onChange={(e) =>
                  setPostForm({ ...postForm, content: e.target.value })
                }
                required
                rows="4"
                style={inputStyle}
              />
              <select
                value={postForm.category}
                onChange={(e) =>
                  setPostForm({ ...postForm, category: e.target.value })
                }
                style={inputStyle}
              >
                <option value="news">News</option>
                <option value="discussion">Discussion</option>
              </select>
              <input
                type="text"
                placeholder="AI Summary (optional)"
                value={postForm.aiSummary}
                onChange={(e) =>
                  setPostForm({ ...postForm, aiSummary: e.target.value })
                }
                style={inputStyle}
              />
              <button type="submit" style={primaryButton}>
                Create Post
              </button>
            </form>
          </div>

          <div style={{ ...sectionCard, marginTop: "22px" }}>
            <h3 style={sectionTitle}>Create Help Request</h3>
            <form
              onSubmit={handleHelpSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <textarea
                placeholder="Describe the help needed"
                value={helpForm.description}
                onChange={(e) =>
                  setHelpForm({ ...helpForm, description: e.target.value })
                }
                required
                rows="3"
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Location"
                value={helpForm.location}
                onChange={(e) =>
                  setHelpForm({ ...helpForm, location: e.target.value })
                }
                style={inputStyle}
              />
              <button type="submit" style={primaryButton}>
                Request Help
              </button>
            </form>
          </div>
        </div>

        <div>
          <div>
            <h3 style={listTitle}>Posts</h3>
            {postsData?.posts?.length ? (
              postsData.posts.map((post) => (
                <div key={post.id} style={itemCard}>
                  <h4 style={{ marginTop: 0, marginBottom: "10px", fontSize: "1.35rem" }}>
                    {post.title}
                  </h4>
                  <p><strong>Author:</strong> {post.author}</p>
                  <p><strong>Category:</strong> {post.category}</p>
                  <p>{post.content}</p>
                  {post.aiSummary && (
                    <p>
                      <strong>AI Summary:</strong> {post.aiSummary}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p style={emptyText}>No posts yet.</p>
            )}
          </div>

          <div style={{ marginTop: "28px" }}>
            <h3 style={listTitle}>Help Requests</h3>
            {helpData?.helpRequests?.length ? (
              helpData.helpRequests.map((req) => (
                <div key={req.id} style={itemCard}>
                  <p><strong>Author:</strong> {req.author}</p>
                  <p><strong>Description:</strong> {req.description}</p>
                  <p><strong>Location:</strong> {req.location || "Not specified"}</p>
                  <p><strong>Resolved:</strong> {req.isResolved ? "Yes" : "No"}</p>
                  <p>
                    <strong>Volunteers:</strong>{" "}
                    {req.volunteers?.length ? req.volunteers.join(", ") : "None yet"}
                  </p>
                </div>
              ))
            ) : (
              <p style={emptyText}>No help requests yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const sectionCard = {
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "18px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: "14px",
  fontSize: "1.6rem",
};

const listTitle = {
  fontSize: "1.8rem",
  marginBottom: "14px",
};

const itemCard = {
  background: "white",
  border: "1px solid #dbe3ef",
  borderRadius: "14px",
  padding: "18px",
  marginBottom: "14px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "1rem",
};

const primaryButton = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
};

const emptyText = {
  color: "#6b7280",
  fontStyle: "italic",
};

export default CommunityApp;