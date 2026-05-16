import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import './Footer.css'

export default function Footer({ name, avatar, likes = 0, views = 0, comments = 0, price = null, commentItems = [], onLike, onSubmitComment, onDeleteComment, currentUserId, projectOwnerId, isAdmin = false, isLiked = false }) {
    const [draft, setDraft] = useState('')
    const navigate = useNavigate()
    const { user } = useAuth()
    
    // Use logged-in user's avatar for the comment input section
    const loggedInUserAvatar = user?.avatarUrl || user?.profile?.avatarUrl
    const loggedInUserName = user?.publicName || user?.username || user?.profile?.publicName || user?.profile?.username
    const initials = (loggedInUserName || 'U').charAt(0).toUpperCase()
    const authorName = loggedInUserName || 'Anónimo'

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
                        {loggedInUserAvatar ? (
                            <img className="pf-creator-avatar" src={loggedInUserAvatar} alt={authorName} />
                        ) : (
                            <div className="pf-creator-avatar pf-creator-fallback">{initials}</div>
                        )}
                    </div>
                    <form className="pf-input-section" onSubmit={handleSubmit}>
                        <textarea
                            className="pf-input"
                            placeholder="¿Qué te parece este proyecto?"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                        />
                        <button type="submit" className="pf-submit-btn">➤</button>
                    </form>
                </div>
                <div className="pf-divider"></div>
                <div className="pf-stats-row">
                    {price && <button className="pf-price-btn">{price.toFixed(2)}€</button>}
                    <button className={`pf-like-btn${isLiked ? ' liked' : ''}`} onClick={onLike} aria-pressed={isLiked}>
                        <svg className="pf-stat-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 16H0V6h4V0h6v4h6v12H4zM6 2v12h8v-1h-2v-2h2v-1h-2V8h2V6H8V2H6zM2 8v6h2V8H2z" fillRule="evenodd"/>
                        </svg> {likes}
                    </button>
                    <span className="pf-counter">
                        <svg className="pf-stat-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 12v4l-5-4H0V0h16v12zm-2-2V2H2v8h12zm-2.5 0l2.5 2v-2h-2.5zM4 4h8v2H4V4z" fillRule="evenodd"/>
                        </svg>
                        {comments}
                    </span>
                    <span className="pf-views">
                        <svg className="pf-stat-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 16h16V0H0v16zm2-4V2h12v10H2zm2-2h2V8H4v2zm6 0h2V8h-2v2z" fillRule="evenodd"/>
                        </svg>
                        {views}
                    </span>
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
                                            <span className="pf-comment-author" onClick={() => author.id && navigate(`/profile/${author.id}`)} style={{ cursor: author.id ? 'pointer' : 'default' }}>{displayName}</span>
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
