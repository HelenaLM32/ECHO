import React, { useState } from 'react'
import './ProjectFooter.css'

export default function ProjectFooter({ name, avatar, likes = 0, views = 0, comments = 0, commentItems = [], onLike, onSubmitComment, onDeleteComment, currentUserId, projectOwnerId, isAdmin = false, isLiked = false }) {
    const [draft, setDraft] = useState('')
    const initials = (name || 'U').charAt(0).toUpperCase()
    const authorName = name || 'Anónimo'

    function handleSubmit(event) {
        event.preventDefault()
        const trimmed = draft.trim()
        if (!trimmed || !onSubmitComment) return
        onSubmitComment(trimmed)
        setDraft('')
    }

    function formatTime(createdAt) {
        if (!createdAt) return ''
        const date = new Date(createdAt)
        const now = new Date()
        const diff = Math.floor((now - date) / 1000)
        if (diff < 60) return 'Hace unos segundos'
        if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`
        if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`
        return `Hace ${Math.floor(diff / 86400)} días`
    }

    return (
        <div className="project-footer">
            <div className="pf-card">
                <div className="pf-header">
                    <div className="pf-user-info">
                        {avatar ? (
                            <img className="pf-creator-avatar" src={avatar} alt={authorName} />
                        ) : (
                            <div className="pf-creator-avatar pf-creator-fallback">{initials}</div>
                        )}
                    </div>
                    <form className="pf-input-section" onSubmit={handleSubmit}>
                        <textarea
                            className="pf-input"
                            placeholder="¿Qué te arece este proyecto?"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                        />
                        <button type="submit" className="pf-submit-btn">➤</button>
                    </form>
                </div>
                <div className="pf-divider"></div>
                <div className="pf-stats-row">
                    <button className="pf-like-btn" onClick={onLike} aria-pressed={isLiked}>
                        {isLiked ? '❤️' : '🤍'} {likes}
                    </button>
                    <span className="pf-counter">💬 {comments}</span>
                    <span className="pf-views">👁️ {views}</span>
                </div>
                <div className="pf-divider"></div>
                <div className="pf-comments-section">
                    {commentItems.length === 0 ? (
                        <div className="pf-empty">Sé el primero en comentar</div>
                    ) : (
                        commentItems.map((comment, idx) => {
                            const author = comment.author || {}
                            const displayName = author.publicName || author.username || 'Anónimo'
                            const letter = displayName.charAt(0).toUpperCase()
                            const timeAgo = formatTime(comment.createdAt)
                            const commentAvatar = author.avatarUrl
                            return (
                                <div key={comment.id || `${idx}`} className="pf-comment">
                                    {commentAvatar ? (
                                        <img className="pf-comment-avatar" src={commentAvatar} alt={displayName} />
                                    ) : (
                                        <div className="pf-comment-avatar pf-comment-avatar-fallback">{letter}</div>
                                    )}
                                    <div className="pf-comment-content">
                                        <div className="pf-comment-meta">
                                            <span className="pf-comment-author">{displayName}</span>
                                            <span className="pf-comment-time">· {timeAgo}</span>
                                            {onDeleteComment && (comment.author?.id === currentUserId || projectOwnerId === currentUserId || isAdmin) && (
                                                <button
                                                    type="button"
                                                    className="pf-comment-delete-btn"
                                                    onClick={() => onDeleteComment(comment.id)}
                                                >
                                                    ×
                                                </button>
                                            )}

                                        </div>
                                        <div className="pf-comment-text">{comment.comment}</div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
