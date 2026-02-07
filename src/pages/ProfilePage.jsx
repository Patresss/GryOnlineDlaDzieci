import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useProfile } from "../context/ProfileContext";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { profile, setAvatar, setName, resetProfile, AVATARS } = useProfile();
  const [editing, setEditing] = useState(!profile.avatar);
  const [tempName, setTempName] = useState(profile.name || "");
  const navigate = useNavigate();

  const handleSave = () => {
    setName(tempName);
    setEditing(false);
  };

  return (
    <div className="game-page game-page--profile">
      <BackButton />
      <h2 className="profile-title">Mój profil</h2>

      {editing || !profile.avatar ? (
        <div className="profile-setup">
          <p className="profile-setup__label">Wybierz swojego zwierzaka:</p>
          <div className="profile-avatars">
            {AVATARS.map((a) => (
              <button
                key={a}
                className={`profile-avatar ${profile.avatar === a ? "profile-avatar--selected" : ""}`}
                onClick={() => setAvatar(a)}
              >
                {a}
              </button>
            ))}
          </div>
          <input
            className="profile-name-input"
            type="text"
            placeholder="Twoje imię..."
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            maxLength={20}
          />
          <button className="profile-save-btn" onClick={handleSave} disabled={!profile.avatar}>
            Zapisz!
          </button>
        </div>
      ) : (
        <div className="profile-display">
          <div className="profile-display__avatar">{profile.avatar}</div>
          <h3 className="profile-display__name">{profile.name || "Anonimowy gracz"}</h3>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat__value">{profile.stars}</span>
              <span className="profile-stat__label">Gwiazdek</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat__value">{Object.keys(profile.gamesCompleted).length}</span>
              <span className="profile-stat__label">Różnych gier</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat__value">{profile.stickers.length}</span>
              <span className="profile-stat__label">Naklejek</span>
            </div>
          </div>

          <h4 className="profile-section-title">Ukończone gry:</h4>
          <div className="profile-completed">
            {Object.entries(profile.gamesCompleted).length === 0 ? (
              <p className="profile-empty">Jeszcze żadna gra nie ukończona!</p>
            ) : (
              Object.entries(profile.gamesCompleted).map(([game, count]) => (
                <div key={game} className="profile-completed__item">
                  <span>{game}</span>
                  <span className="profile-completed__count">x{count}</span>
                </div>
              ))
            )}
          </div>

          <div className="profile-actions">
            <button className="profile-edit-btn" onClick={() => setEditing(true)}>Edytuj profil</button>
            <button className="profile-rewards-btn" onClick={() => navigate("/nagrody")}>Moje naklejki</button>
          </div>
        </div>
      )}
    </div>
  );
}
