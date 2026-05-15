import { useNavigate } from 'react-router-dom';
import projectStyles from '../ProjectCard/ProjectCard.module.css';
import styles from './ProfileCard.module.css';

function ProfileCard({ profile }) {
  const navigate = useNavigate();
  
  const userId = profile?.userId || profile?.id;
  const publicName = profile?.publicName || profile?.username || 'Usuario';
  const username = profile?.username || '';
  const avatarUrl = profile?.avatarUrl;
  const bannerUrl = profile?.bannerUrl;
  const location = profile?.location || '';
  const followers = profile?.followers || 0;
  const following = profile?.following || 0;
  
  const initials = publicName.charAt(0).toUpperCase();

  const handleClick = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <button 
      type="button" 
      className={`${projectStyles.cardWrapper} ${projectStyles.cardButton} ${styles.profileCard}`} 
      onClick={handleClick}
    >
      <article className={projectStyles.card}>
        <div className={projectStyles.cover}>
          {bannerUrl ? (
            <img src={bannerUrl} alt={publicName} className={projectStyles.coverImg} />
          ) : (
            <div className={projectStyles.coverFallback}>{initials}</div>
          )}
        </div>
        <div className={styles.avatarContainer}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={publicName} className={projectStyles.creatorAvatar} />
          ) : (
            <div className={`${projectStyles.creatorAvatar} ${projectStyles.creatorFallback}`}>{initials}</div>
          )}
        </div>
        <div className={projectStyles.footer}>
          <div className={projectStyles.footerLeft}>
            {/* Avatar oculto aquí, se muestra en avatarContainer */}
            {avatarUrl ? (
              <img src={avatarUrl} alt={publicName} className={projectStyles.creatorAvatar} />
            ) : (
              <div className={`${projectStyles.creatorAvatar} ${projectStyles.creatorFallback}`}>{initials}</div>
            )}
            <div>
              <h3 className={projectStyles.title}>{publicName}</h3>
              <p className={projectStyles.author}>
                {location ? location : (username ? `@${username}` : 'Ver perfil')}
              </p>
            </div>
          </div>
          <div className={projectStyles.stats}>
            {(followers > 0 || following > 0) && (
              <>
                <span className={projectStyles.statItem}>
                  <svg className={projectStyles.statIcon} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" fillRule="evenodd"/>
                  </svg>
                  {followers}
                </span>
              </>
            )}
          </div>
        </div>
      </article>
    </button>
  );
}

export default ProfileCard;
