import { useState, useRef } from "react";

const INITIAL_POSTS = [
  {
    id: 1,
    user: "dominic.art",
    avatar: "D",
    avatarColor: "#a78bfa",
    time: "2 min ago",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80",
    caption: "Spent the morning doing gesture drawings. Starting to feel the difference in my lines 🎨",
    likes: 142,
    comments: [
      { user: "sketchy.vibes", text: "Your lines are so clean now!" },
      { user: "artdaily_", text: "Love the progress 🔥" },
    ],
    liked: false,
    saved: false,
  },
  {
    id: 2,
    user: "urban.lens",
    avatar: "U",
    avatarColor: "#34d399",
    time: "1 hr ago",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80",
    caption: "City never sleeps. Neither do I apparently 🌆",
    likes: 388,
    comments: [
      { user: "nightowl.photos", text: "What camera did you use?" },
    ],
    liked: false,
    saved: false,
  },
];

const STORIES = [
  { id: 1, user: "Your story", avatar: "+", avatarColor: "#2a2a3a", isAdd: true },
  { id: 2, user: "kai.draws", avatar: "K", avatarColor: "#f472b6" },
  { id: 3, user: "luz.foto", avatar: "L", avatarColor: "#38bdf8" },
  { id: 4, user: "reo_art", avatar: "R", avatarColor: "#facc15" },
  { id: 5, user: "nova.ui", avatar: "N", avatarColor: "#34d399" },
];

function Avatar({ letter, color, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color, display: "flex", alignItems: "center",
      justifyContent: "center", fontWeight: 700,
      fontSize: size * 0.38, color: "#fff", flexShrink: 0,
    }}>
      {letter}
    </div>
  );
}

function StoryRing({ children, active }) {
  return (
    <div style={{
      padding: 2, borderRadius: "50%",
      background: active ? "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" : "#2a2a3a",
    }}>
      <div style={{ padding: 2, background: "#0f0f1a", borderRadius: "50%" }}>
        {children}
      </div>
    </div>
  );
}

function NewPostModal({ onClose, onPost }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [step, setStep] = useState("upload");
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setImage(ev.target.result); setStep("preview"); };
    reader.readAsDataURL(file);
  };

  const handlePost = () => {
    if (!image) return;
    onPost({ image, caption });
    onClose();
  };

  return (
    <div style={s.modalOverlay}>
      <div style={s.modal}>
        <div style={s.modalHeader}>
          <button style={s.modalClose} onClick={onClose}>✕</button>
          <div style={s.modalTitle}>New post</div>
          {step === "preview" ? (
            <button style={s.shareBtn} onClick={handlePost}>Share</button>
          ) : <div style={{ width: 40 }} />}
        </div>

        {step === "upload" && (
          <div style={s.uploadArea} onClick={() => fileRef.current.click()}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
            <div style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 6 }}>Tap to upload your art</div>
            <div style={{ color: "#6b7280", fontSize: 13 }}>Photos from your camera roll</div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
          </div>
        )}

        {step === "preview" && (
          <div>
            <img src={image} alt="" style={s.previewImg} />
            <div style={s.captionWrap}>
              <Avatar letter="D" color="#a78bfa" size={36} />
              <textarea
                style={s.captionInput}
                placeholder="Write a caption..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Post({ post, onLike, onSave, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  return (
    <div style={s.post}>
      <div style={s.postHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StoryRing active>
            <Avatar letter={post.avatar} color={post.avatarColor} size={34} />
          </StoryRing>
          <div>
            <div style={s.postUser}>{post.user}</div>
            <div style={s.postTime}>{post.time}</div>
          </div>
        </div>
        <div style={s.moreBtn}>···</div>
      </div>

      <img src={post.image} alt="" style={s.postImg} />

      <div style={s.actions}>
        <div style={{ display: "flex", gap: 14 }}>
          <button onClick={() => onLike(post.id)} style={s.actionBtn}>
            <span style={{ fontSize: 22, transition: "transform 0.15s", transform: post.liked ? "scale(1.2)" : "scale(1)", display: "block" }}>
              {post.liked ? "❤️" : "🤍"}
            </span>
          </button>
          <button onClick={() => setShowComments(!showComments)} style={s.actionBtn}>
            <span style={{ fontSize: 20 }}>💬</span>
          </button>
          <button style={s.actionBtn}><span style={{ fontSize: 20 }}>📤</span></button>
        </div>
        <button onClick={() => onSave(post.id)} style={s.actionBtn}>
          <span style={{ fontSize: 20 }}>{post.saved ? "🔖" : "🏷️"}</span>
        </button>
      </div>

      <div style={s.likes}>{post.likes.toLocaleString()} likes</div>
      <div style={s.caption}>
        <span style={s.captionUser}>{post.user} </span>{post.caption}
      </div>

      {post.comments.length > 0 && (
        <div style={s.viewComments} onClick={() => setShowComments(!showComments)}>
          {showComments ? "Hide comments" : `View all ${post.comments.length} comments`}
        </div>
      )}

      {showComments && (
        <div style={{ paddingLeft: 14, paddingRight: 14 }}>
          {post.comments.map((c, i) => (
            <div key={i} style={s.comment}>
              <span style={s.captionUser}>{c.user} </span>
              <span style={{ color: "#e2e8f0", fontSize: 13 }}>{c.text}</span>
            </div>
          ))}
        </div>
      )}

      <div style={s.commentRow}>
        <Avatar letter="D" color="#a78bfa" size={26} />
        <input
          style={s.commentInput}
          placeholder="Add a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && newComment.trim()) {
              onComment(post.id, newComment.trim());
              setNewComment("");
            }
          }}
        />
        {newComment && (
          <button style={s.postCommentBtn} onClick={() => { onComment(post.id, newComment.trim()); setNewComment(""); }}>
            Post
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [tab, setTab] = useState("home");
  const [showNewPost, setShowNewPost] = useState(false);

  const handleLike = (id) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const handleSave = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  };

  const handleComment = (id, text) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, comments: [...p.comments, { user: "dominic.art", text }] } : p
    ));
  };

  const handleNewPost = ({ image, caption }) => {
    const newPost = {
      id: Date.now(),
      user: "dominic.art",
      avatar: "D",
      avatarColor: "#a78bfa",
      time: "Just now",
      image,
      caption: caption || "New post 🎨",
      likes: 0,
      comments: [],
      liked: false,
      saved: false,
    };
    setPosts(prev => [newPost, ...prev]);
    setTab("home");
  };

  return (
    <div style={s.root}>
      <div style={s.app}>
        <header style={s.topNav}>
          <div style={s.navLogo}>GRAMO</div>
          <div style={{ display: "flex", gap: 16 }}>
            <span style={s.navIcon}>🔔</span>
            <span style={s.navIcon}>✉️</span>
          </div>
        </header>

        <div style={s.storiesWrap}>
          <div style={s.stories}>
            {STORIES.map(story => (
              <div key={story.id} style={s.story} onClick={() => story.isAdd && setShowNewPost(true)}>
                {story.isAdd ? (
                  <div style={s.addStory}>
                    <Avatar letter={story.avatar} color={story.avatarColor} size={56} />
                  </div>
                ) : (
                  <StoryRing active>
                    <Avatar letter={story.avatar} color={story.avatarColor} size={56} />
                  </StoryRing>
                )}
                <div style={s.storyName}>{story.user}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={s.divider} />

        <div style={s.feed}>
          {posts.map(post => (
            <Post key={post.id} post={post} onLike={handleLike} onSave={handleSave} onComment={handleComment} />
          ))}
        </div>

        <nav style={s.bottomNav}>
          {[
            { id: "home", icon: "🏠" },
            { id: "search", icon: "🔍" },
            { id: "add", icon: "➕", action: () => setShowNewPost(true) },
            { id: "reels", icon: "🎬" },
            { id: "profile", icon: "👤" },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); item.action && item.action(); }}
              style={{
                ...s.navBtn,
                opacity: tab === item.id ? 1 : 0.45,
                transform: tab === item.id ? "scale(1.2)" : "scale(1)",
              }}
            >
              {item.icon}
            </button>
          ))}
        </nav>

        {showNewPost && (
          <NewPostModal onClose={() => setShowNewPost(false)} onPost={handleNewPost} />
        )}
      </div>
    </div>
  );
}

const s = {
  root: { background: "#000", minHeight: "100vh", display: "flex", justifyContent: "center", fontFamily: "'Inter', system-ui, sans-serif" },
  app: { width: "100%", maxWidth: 480, background: "#0f0f1a", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", paddingBottom: 60 },
  topNav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid #1e1e30", position: "sticky", top: 0, background: "#0f0f1a", zIndex: 10 },
  navLogo: { fontSize: 22, fontWeight: 800, color: "#e2e8f0", letterSpacing: "-0.03em" },
  navIcon: { fontSize: 22, cursor: "pointer" },
  storiesWrap: { overflowX: "auto", padding: "12px 0" },
  stories: { display: "flex", gap: 14, paddingLeft: 16, paddingRight: 16, width: "max-content" },
  story: { display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer" },
  addStory: { border: "2px dashed #2a2a3a", borderRadius: "50%", padding: 2 },
  storyName: { fontSize: 11, color: "#9ca3af", maxWidth: 60, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  divider: { height: 1, background: "#1e1e30" },
  feed: { flex: 1 },
  post: { borderBottom: "1px solid #1e1e30", paddingBottom: 8, marginBottom: 8 },
  postHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px" },
  postUser: { fontSize: 13, fontWeight: 700, color: "#e2e8f0" },
  postTime: { fontSize: 11, color: "#6b7280" },
  moreBtn: { color: "#6b7280", fontSize: 18, cursor: "pointer", letterSpacing: 1 },
  postImg: { width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" },
  actions: { display: "flex", justifyContent: "space-between", padding: "10px 14px 4px" },
  actionBtn: { background: "none", border: "none", cursor: "pointer", padding: 2 },
  likes: { paddingLeft: 14, fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 },
  caption: { paddingLeft: 14, paddingRight: 14, fontSize: 13, color: "#d1d5db", marginBottom: 4, lineHeight: 1.5 },
  captionUser: { fontWeight: 700, color: "#e2e8f0" },
  viewComments: { paddingLeft: 14, fontSize: 13, color: "#6b7280", cursor: "pointer", marginBottom: 4 },
  comment: { fontSize: 13, marginBottom: 4, lineHeight: 1.5 },
  commentRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderTop: "1px solid #1a1a2a" },
  commentInput: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#9ca3af", fontSize: 13 },
  postCommentBtn: { background: "none", border: "none", color: "#a78bfa", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  bottomNav: { position: "fixed", bottom: 0, width: "100%", maxWidth: 480, background: "#0f0f1a", borderTop: "1px solid #1e1e30", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 10 },
  navBtn: { background: "none", border: "none", fontSize: 22, cursor: "pointer", transition: "all 0.15s ease" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  modal: { background: "#13131f", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, maxHeight: "90vh", overflow: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px 12px", borderBottom: "1px solid #1e1e30" },
  modalTitle: { fontSize: 15, fontWeight: 700, color: "#e2e8f0" },
  modalClose: { background: "none", border: "none", color: "#6b7280", fontSize: 18, cursor: "pointer", width: 40 },
  shareBtn: { background: "#a78bfa", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  uploadArea: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", cursor: "pointer" },
  previewImg: { width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" },
  captionWrap: { display: "flex", gap: 12, padding: "16px", alignItems: "flex-start" },
  captionInput: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: 14, resize: "none", fontFamily: "inherit" },
};